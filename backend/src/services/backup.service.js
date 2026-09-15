const prisma = require("../config/prisma");
const { logAudit } = require("./audit.service");
const ApiError = require("../utils/ApiError");

async function exportBusinessData() {
  const [
    categories,
    products,
    suppliers,
    customers,
    sales,
    saleItems,
    payments,
    invoices,
    invoiceItems,
    purchaseOrders,
    purchaseOrderItems,
    expenseCategories,
    expenses,
    businessSettings,
  ] = await Promise.all([
    prisma.category.findMany(),
    prisma.product.findMany(),
    prisma.supplier.findMany(),
    prisma.customer.findMany(),
    prisma.sale.findMany(),
    prisma.saleItem.findMany(),
    prisma.payment.findMany(),
    prisma.invoice.findMany(),
    prisma.invoiceItem.findMany(),
    prisma.purchaseOrder.findMany(),
    prisma.purchaseOrderItem.findMany(),
    prisma.expenseCategory.findMany(),
    prisma.expense.findMany(),
    prisma.businessSetting.findMany(),
  ]);

  return {
    exportedAt: new Date().toISOString(),
    tables: {
      categories,
      products,
      suppliers,
      customers,
      sales,
      saleItems,
      payments,
      invoices,
      invoiceItems,
      purchaseOrders,
      purchaseOrderItems,
      expenseCategories,
      expenses,
      businessSettings,
    },
  };
}

async function createBackup(actorId) {
  const startedAt = new Date();
  const data = await exportBusinessData();
  const json = JSON.stringify(data);
  const fileSizeBytes = Buffer.byteLength(json, "utf8");
  const fileName = `smartbizz-backup-${Date.now()}.json`;

  const backup = await prisma.backup.create({
    data: {
      fileName,
      fileSizeBytes,
      storagePath: "client-download",
      triggeredBy: actorId,
      status: "Completed",
      startedAt,
      completedAt: new Date(),
    },
  });

  await logAudit({
    userId: actorId,
    action: "backup.created",
    entityType: "backup",
    entityId: backup.id,
    metadata: { fileName, fileSizeBytes },
  });

  return { backup, data, fileName };
}

async function listBackups({ page, limit }) {
  const [items, total] = await prisma.$transaction([
    prisma.backup.findMany({
      orderBy: { startedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: { trigger: { select: { id: true, fullName: true } } },
    }),
    prisma.backup.count(),
  ]);

  return {
    items: items.map((backup) => ({
      id: backup.id,
      fileName: backup.fileName,
      fileSizeBytes: backup.fileSizeBytes,
      status: backup.status,
      startedAt: backup.startedAt,
      completedAt: backup.completedAt,
      triggeredByName: backup.trigger?.fullName || "System",
    })),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

module.exports = { createBackup, listBackups, restoreBackup };

const RESTORE_TABLE_ORDER = [
  "businessSettings",
  "expenseCategories",
  "categories",
  "suppliers",
  "customers",
  "products",
  "sales",
  "invoices",
  "expenses",
  "purchaseOrders",
  "saleItems",
  "payments",
  "invoiceItems",
  "purchaseOrderItems",
];

const DELETE_TABLE_ORDER = [
  "purchaseOrderItems",
  "invoiceItems",
  "payments",
  "saleItems",
  "purchaseOrders",
  "expenses",
  "invoices",
  "sales",
  "products",
  "customers",
  "suppliers",
  "categories",
  "expenseCategories",
  "businessSettings",
];

const MODEL_BY_TABLE = {
  businessSettings: "businessSetting",
  expenseCategories: "expenseCategory",
  categories: "category",
  suppliers: "supplier",
  customers: "customer",
  products: "product",
  sales: "sale",
  invoices: "invoice",
  expenses: "expense",
  purchaseOrders: "purchaseOrder",
  saleItems: "saleItem",
  payments: "payment",
  invoiceItems: "invoiceItem",
  purchaseOrderItems: "purchaseOrderItem",
};

const SQL_TABLE_BY_TABLE = {
  businessSettings: "business_settings",
  expenseCategories: "expense_categories",
  categories: "categories",
  suppliers: "suppliers",
  customers: "customers",
  products: "products",
  sales: "sales",
  invoices: "invoices",
  expenses: "expenses",
  purchaseOrders: "purchase_orders",
  saleItems: "sale_items",
  payments: "payments",
  invoiceItems: "invoice_items",
  purchaseOrderItems: "purchase_order_items",
};

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;

function reviveRow(row) {
  const revived = {};
  Object.entries(row).forEach(([key, value]) => {
    revived[key] = typeof value === "string" && ISO_DATE_PATTERN.test(value) ? new Date(value) : value;
  });
  return revived;
}

async function restoreBackup(tables, actorId) {
  if (!tables || typeof tables !== "object") {
    throw ApiError.badRequest("This file doesn't look like a valid SmartBizz backup.");
  }

  const rowsByTable = {};

  RESTORE_TABLE_ORDER.forEach((table) => {
    const rows = Array.isArray(tables[table]) ? tables[table] : [];
    rowsByTable[table] = rows.map(reviveRow);
  });

  const categoryParentLinks = rowsByTable.categories
    .map((row) => ({ id: row.id, parentCategoryId: row.parentCategoryId ?? null }))
    .filter((link) => link.parentCategoryId !== null);

  rowsByTable.categories = rowsByTable.categories.map((row) => ({
    ...row,
    parentCategoryId: null,
  }));

  try {
    await prisma.$transaction(
      async (tx) => {
        await tx.stockMovement.deleteMany();

        for (const table of DELETE_TABLE_ORDER) {
          await tx[MODEL_BY_TABLE[table]].deleteMany();
        }

        for (const table of RESTORE_TABLE_ORDER) {
          const rows = rowsByTable[table];
          if (rows.length === 0) continue;
          await tx[MODEL_BY_TABLE[table]].createMany({ data: rows });
        }

        for (const link of categoryParentLinks) {
          await tx.category.update({
            where: { id: link.id },
            data: { parentCategoryId: link.parentCategoryId },
          });
        }

        for (const table of RESTORE_TABLE_ORDER) {
          const sqlTable = SQL_TABLE_BY_TABLE[table];
          await tx.$executeRawUnsafe(
            `SELECT setval(pg_get_serial_sequence('"${sqlTable}"', 'id'), COALESCE((SELECT MAX(id) FROM "${sqlTable}"), 1))`
          );
        }
      },
      { timeout: 60000 }
    );
  } catch (error) {
    if (error.code === "P2003") {
      throw ApiError.conflict(
        "Restore failed because the backup references a user account (such as a cashier or staff member) that no longer exists. No changes were made."
      );
    }

    throw ApiError.internal("Restore failed. No changes were made to your data.");
  }

  await logAudit({
    userId: actorId,
    action: "backup.restored",
    entityType: "backup",
    entityId: null,
    metadata: { restoredAt: new Date().toISOString() },
  });
}