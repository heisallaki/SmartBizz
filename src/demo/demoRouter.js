import DEMO_USER from "./demoUser";
import { demoAuditMeta, demoDashboard, demoReports } from "./demoFixtures";
import { collections, generateCode, generateId, singletons } from "./demoStore";

function ok(data, meta) {
  const body = { success: true, data };
  if (meta) body.meta = meta;
  return { status: 200, body };
}

function created(data) {
  return { status: 201, body: { success: true, data } };
}

function deriveStatus(stock, threshold) {
  if (stock <= 0) return "OutOfStock";
  if (stock <= (threshold ?? 10)) return "LowStock";
  return "InStock";
}

function lookupCategory(categoryId) {
  if (!categoryId) return null;
  const category = collections.categories.find(categoryId);
  return category ? { id: category.id, name: category.name } : null;
}

function lookupSupplier(supplierId) {
  if (!supplierId) return null;
  const supplier = collections.suppliers.find(supplierId);
  return supplier ? { id: supplier.id, name: supplier.name } : null;
}

function lookupSupplierName(supplierId) {
  const supplier = supplierId ? collections.suppliers.find(supplierId) : null;
  return supplier ? supplier.name : "";
}

function lookupCustomerName(customerId) {
  if (!customerId) return "Walk-in Customer";
  const customer = collections.customers.find(customerId);
  return customer ? `${customer.firstName} ${customer.lastName}` : "Walk-in Customer";
}

function lookupRole(roleId) {
  const role = collections.roles.find(roleId);
  return role ? { id: role.id, name: role.name } : { id: roleId, name: "Cashier" };
}

function computeSaleTotals(items = [], discount = 0, taxRate = 16) {
  const subtotal = items.reduce((sum, item) => {
    const product = item.productId ? collections.products.find(item.productId) : null;
    const unitPrice = item.unitPrice ?? product?.price ?? 0;
    return sum + unitPrice * (item.quantity ?? 0);
  }, 0);

  const discounted = Math.max(subtotal - (discount || 0), 0);
  const taxTotal = Math.round(discounted * ((taxRate ?? 16) / 100));
  const grandTotal = discounted + taxTotal;

  const lineItems = items.map((item) => {
    const product = item.productId ? collections.products.find(item.productId) : null;
    const unitPrice = item.unitPrice ?? product?.price ?? 0;

    return {
      productId: item.productId,
      productName: product?.name ?? item.productName ?? "Product",
      sku: product?.sku ?? item.sku ?? "",
      quantity: item.quantity ?? 0,
      unitPrice,
      lineTotal: unitPrice * (item.quantity ?? 0),
    };
  });

  return { subtotal, taxTotal, grandTotal, items: lineItems };
}

function computeCustomerStatistics() {
  const customers = collections.customers.list();

  return {
    totalCustomers: customers.length,
    activeCustomers: customers.filter((customer) => customer.status === "Active").length,
    inactiveCustomers: customers.filter((customer) => customer.status === "Inactive").length,
    outstandingBalance: customers.reduce((sum, customer) => sum + (customer.outstandingBalance || 0), 0),
    totalRevenue: customers.reduce((sum, customer) => sum + (customer.totalSpent || 0), 0),
  };
}

const routes = [
  { method: "get", pattern: /^\/auth\/profile$/, handler: () => ok(DEMO_USER) },
  { method: "post", pattern: /^\/auth\/logout$/, handler: () => ok({ message: "Logged out." }) },
  {
    method: "post",
    pattern: /^\/auth\/change-password$/,
    handler: () => ok({ message: "Password updated successfully." }),
  },

  { method: "get", pattern: /^\/dashboard$/, handler: () => ok(demoDashboard) },

  { method: "get", pattern: /^\/reports$/, handler: () => ok(demoReports) },

  { method: "get", pattern: /^\/categories$/, handler: () => ok(collections.categories.list()) },
  {
    method: "post",
    pattern: /^\/categories$/,
    handler: (params, config) => {
      const record = { id: generateId(), name: (config.data?.name || "").trim() };
      return created(collections.categories.insert(record));
    },
  },

  { method: "get", pattern: /^\/products$/, handler: () => ok(collections.products.list()) },
  {
    method: "get",
    pattern: /^\/products\/([^/]+)$/,
    handler: ([id]) => {
      const product = collections.products.find(id);
      if (!product) return { status: 404, body: { success: false, message: "Product not found." } };
      return ok(product);
    },
  },
  {
    method: "post",
    pattern: /^\/products$/,
    handler: (params, config) => {
      const { categoryId, ...rest } = config.data || {};
      const stock = Number(rest.stock ?? 0);

      const record = {
        id: generateId(),
        sku: rest.sku,
        name: rest.name,
        description: rest.description || "",
        price: Number(rest.price ?? 0),
        costPrice: Number(rest.costPrice ?? 0),
        stock,
        lowStockThreshold: Number(rest.lowStockThreshold ?? 10),
        status: rest.status || deriveStatus(stock, rest.lowStockThreshold),
        isActive: true,
        category: lookupCategory(categoryId),
        supplier: lookupSupplier(rest.supplierId),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return created(collections.products.insert(record));
    },
  },
  {
    method: "patch",
    pattern: /^\/products\/([^/]+)$/,
    handler: ([id], config) => {
      const { categoryId, ...rest } = config.data || {};
      const patch = {
        ...rest,
        updatedAt: new Date().toISOString(),
      };
      if (categoryId !== undefined) patch.category = lookupCategory(categoryId);
      if (rest.supplierId !== undefined) patch.supplier = lookupSupplier(rest.supplierId);

      const updated = collections.products.patch(id, patch);
      if (!updated) return { status: 404, body: { success: false, message: "Product not found." } };
      return ok(updated);
    },
  },
  {
    method: "post",
    pattern: /^\/products\/([^/]+)\/adjust-stock$/,
    handler: ([id], config) => {
      const product = collections.products.find(id);
      if (!product) return { status: 404, body: { success: false, message: "Product not found." } };

      const newStock = Math.max(product.stock + Number(config.data?.quantityChange ?? 0), 0);
      const updated = collections.products.patch(id, {
        stock: newStock,
        status: deriveStatus(newStock, product.lowStockThreshold),
        updatedAt: new Date().toISOString(),
      });

      return ok({ product: updated });
    },
  },
  {
    method: "post",
    pattern: /^\/products\/batch-adjust-stock$/,
    handler: (params, config) => {
      (config.data?.items || []).forEach((item) => {
        const product = collections.products.find(item.productId);
        if (!product) return;
        const newStock = Math.max(product.stock + Number(item.quantityChange ?? 0), 0);
        collections.products.patch(item.productId, {
          stock: newStock,
          status: deriveStatus(newStock, product.lowStockThreshold),
          updatedAt: new Date().toISOString(),
        });
      });
      return ok({ message: "Stock adjusted." });
    },
  },
  {
    method: "delete",
    pattern: /^\/products\/([^/]+)$/,
    handler: ([id]) => {
      collections.products.remove(id);
      return ok(true);
    },
  },

  { method: "get", pattern: /^\/customers$/, handler: () => ok(collections.customers.list()) },
  { method: "get", pattern: /^\/customers\/statistics$/, handler: () => ok(computeCustomerStatistics()) },
  {
    method: "post",
    pattern: /^\/customers$/,
    handler: (params, config) => {
      const record = {
        ...config.data,
        customerCode: generateCode("CUS"),
        totalOrders: 0,
        totalSpent: 0,
        outstandingBalance: 0,
        lastPurchaseAt: null,
        purchaseHistory: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return created(collections.customers.insert(record));
    },
  },
  {
    method: "patch",
    pattern: /^\/customers\/([^/]+)$/,
    handler: ([id], config) => {
      const updated = collections.customers.patch(id, {
        ...config.data,
        updatedAt: new Date().toISOString(),
      });
      if (!updated) return { status: 404, body: { success: false, message: "Customer not found." } };
      return ok(updated);
    },
  },
  {
    method: "delete",
    pattern: /^\/customers\/([^/]+)$/,
    handler: ([id]) => {
      collections.customers.remove(id);
      return ok(true);
    },
  },

  { method: "get", pattern: /^\/suppliers$/, handler: () => ok(collections.suppliers.list()) },
  {
    method: "post",
    pattern: /^\/suppliers$/,
    handler: (params, config) => {
      const record = {
        ...config.data,
        id: generateId(),
        totalOrders: 0,
        totalSpend: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return created(collections.suppliers.insert(record));
    },
  },
  {
    method: "patch",
    pattern: /^\/suppliers\/([^/]+)$/,
    handler: ([id], config) => {
      const updated = collections.suppliers.patch(id, {
        ...config.data,
        updatedAt: new Date().toISOString(),
      });
      if (!updated) return { status: 404, body: { success: false, message: "Supplier not found." } };
      return ok(updated);
    },
  },
  {
    method: "delete",
    pattern: /^\/suppliers\/([^/]+)$/,
    handler: ([id]) => {
      collections.suppliers.remove(id);
      return ok(true);
    },
  },

  { method: "get", pattern: /^\/sales$/, handler: () => ok(collections.sales.list()) },
  {
    method: "post",
    pattern: /^\/sales$/,
    handler: (params, config) => {
      const payload = config.data || {};
      const totals = computeSaleTotals(payload.items, payload.discount, payload.taxRate);

      const record = {
        id: generateId(),
        invoiceNumber: generateCode("SL-2026"),
        customerId: payload.customerId || null,
        customerName: lookupCustomerName(payload.customerId),
        cashierId: DEMO_USER.id,
        date: new Date().toISOString().slice(0, 10),
        saleDate: new Date().toISOString().slice(0, 10),
        subtotal: totals.subtotal,
        discount: payload.discount || 0,
        taxRate: payload.taxRate ?? 16,
        taxTotal: totals.taxTotal,
        grandTotal: totals.grandTotal,
        total: totals.grandTotal,
        paymentMethod: payload.paymentMethod || "Cash",
        status: payload.status || "Completed",
        notes: payload.notes || "",
        items: totals.items,
      };

      return created(collections.sales.insert(record));
    },
  },
  {
    method: "patch",
    pattern: /^\/sales\/([^/]+)$/,
    handler: ([id], config) => {
      const payload = config.data || {};
      const existing = collections.sales.find(id);
      if (!existing) return { status: 404, body: { success: false, message: "Sale not found." } };

      const totals = computeSaleTotals(
        payload.items ?? existing.items,
        payload.discount ?? existing.discount,
        payload.taxRate ?? existing.taxRate
      );

      const updated = collections.sales.patch(id, {
        customerId: payload.customerId ?? existing.customerId,
        customerName: lookupCustomerName(payload.customerId ?? existing.customerId),
        subtotal: totals.subtotal,
        discount: payload.discount ?? existing.discount,
        taxRate: payload.taxRate ?? existing.taxRate,
        taxTotal: totals.taxTotal,
        grandTotal: totals.grandTotal,
        total: totals.grandTotal,
        paymentMethod: payload.paymentMethod ?? existing.paymentMethod,
        status: payload.status ?? existing.status,
        notes: payload.notes ?? existing.notes,
        items: totals.items,
      });

      return ok(updated);
    },
  },
  {
    method: "post",
    pattern: /^\/sales\/([^/]+)\/void$/,
    handler: ([id]) => {
      const updated = collections.sales.patch(id, { status: "Cancelled" });
      if (!updated) return { status: 404, body: { success: false, message: "Sale not found." } };
      return ok(updated);
    },
  },
  {
    method: "delete",
    pattern: /^\/sales\/([^/]+)$/,
    handler: ([id]) => {
      collections.sales.remove(id);
      return ok(true);
    },
  },

  { method: "get", pattern: /^\/invoices$/, handler: () => ok(collections.invoices.list()) },
  {
    method: "get",
    pattern: /^\/invoices\/([^/]+)$/,
    handler: ([id]) => {
      const invoice = collections.invoices.find(id);
      if (!invoice) return { status: 404, body: { success: false, message: "Invoice not found." } };
      return ok(invoice);
    },
  },
  {
    method: "post",
    pattern: /^\/invoices\/from-sale$/,
    handler: (params, config) => {
      const payload = config.data || {};
      const sale = payload.saleId ? collections.sales.find(payload.saleId) : null;

      const record = {
        id: generateId(),
        invoiceNumber: generateCode("INV"),
        customerId: sale?.customerId ?? payload.customerId ?? null,
        customerName: sale?.customerName ?? lookupCustomerName(payload.customerId),
        saleId: sale?.id ?? payload.saleId ?? null,
        issueDate: new Date().toISOString().slice(0, 10),
        dueDate: payload.dueDate || new Date().toISOString().slice(0, 10),
        grandTotal: sale?.grandTotal ?? payload.grandTotal ?? 0,
        balanceDue: sale?.grandTotal ?? payload.grandTotal ?? 0,
        status: "Unpaid",
        notes: payload.notes || "",
        items: sale?.items ?? payload.items ?? [],
      };

      return created(collections.invoices.insert(record));
    },
  },
  {
    method: "post",
    pattern: /^\/invoices$/,
    handler: (params, config) => {
      const payload = config.data || {};

      const record = {
        id: generateId(),
        invoiceNumber: generateCode("INV"),
        customerId: payload.customerId || null,
        customerName: lookupCustomerName(payload.customerId),
        saleId: null,
        issueDate: new Date().toISOString().slice(0, 10),
        dueDate: payload.dueDate || new Date().toISOString().slice(0, 10),
        grandTotal: payload.grandTotal || 0,
        balanceDue: payload.grandTotal || 0,
        status: "Unpaid",
        notes: payload.notes || "",
        items: payload.items || [],
      };

      return created(collections.invoices.insert(record));
    },
  },
  {
    method: "patch",
    pattern: /^\/invoices\/([^/]+)$/,
    handler: ([id], config) => {
      const updated = collections.invoices.patch(id, config.data || {});
      if (!updated) return { status: 404, body: { success: false, message: "Invoice not found." } };
      return ok(updated);
    },
  },
  {
    method: "post",
    pattern: /^\/invoices\/([^/]+)\/payments$/,
    handler: ([id], config) => {
      const invoice = collections.invoices.find(id);
      if (!invoice) return { status: 404, body: { success: false, message: "Invoice not found." } };

      const amount = Number(config.data?.amount ?? 0);
      const balanceDue = Math.max(invoice.balanceDue - amount, 0);
      const status = balanceDue === 0 ? "Paid" : "PartiallyPaid";

      const updated = collections.invoices.patch(id, { balanceDue, status });
      return ok(updated);
    },
  },
  {
    method: "post",
    pattern: /^\/invoices\/([^/]+)\/void$/,
    handler: ([id]) => {
      const updated = collections.invoices.patch(id, { status: "Void" });
      if (!updated) return { status: 404, body: { success: false, message: "Invoice not found." } };
      return ok(updated);
    },
  },
  {
    method: "delete",
    pattern: /^\/invoices\/([^/]+)$/,
    handler: ([id]) => {
      collections.invoices.remove(id);
      return ok(true);
    },
  },

  { method: "get", pattern: /^\/purchase-orders$/, handler: () => ok(collections.purchaseOrders.list()) },
  {
    method: "get",
    pattern: /^\/purchase-orders\/([^/]+)$/,
    handler: ([id]) => {
      const po = collections.purchaseOrders.find(id);
      if (!po) return { status: 404, body: { success: false, message: "Purchase order not found." } };
      return ok(po);
    },
  },
  {
    method: "post",
    pattern: /^\/purchase-orders$/,
    handler: (params, config) => {
      const payload = config.data || {};
      const items = (payload.items || []).map((item) => {
        const product = item.productId ? collections.products.find(item.productId) : null;
        const unitCost = item.unitCost ?? product?.costPrice ?? 0;
        return {
          productId: item.productId,
          productName: product?.name ?? item.productName ?? "Product",
          sku: product?.sku ?? item.sku ?? "",
          quantity: item.quantity ?? 0,
          unitCost,
          lineTotal: unitCost * (item.quantity ?? 0),
        };
      });

      const record = {
        id: generateId(),
        poNumber: generateCode("PO-2026"),
        supplierId: payload.supplierId,
        supplierName: lookupSupplierName(payload.supplierId),
        orderDate: new Date().toISOString().slice(0, 10),
        grandTotal: items.reduce((sum, item) => sum + item.lineTotal, 0),
        status: "Draft",
        notes: payload.notes || "",
        items,
      };

      return created(collections.purchaseOrders.insert(record));
    },
  },
  {
    method: "patch",
    pattern: /^\/purchase-orders\/([^/]+)\/status$/,
    handler: ([id], config) => {
      const updated = collections.purchaseOrders.patch(id, { status: config.data?.status });
      if (!updated) return { status: 404, body: { success: false, message: "Purchase order not found." } };
      return ok(updated);
    },
  },
  {
    method: "patch",
    pattern: /^\/purchase-orders\/([^/]+)$/,
    handler: ([id], config) => {
      const updated = collections.purchaseOrders.patch(id, config.data || {});
      if (!updated) return { status: 404, body: { success: false, message: "Purchase order not found." } };
      return ok(updated);
    },
  },
  {
    method: "post",
    pattern: /^\/purchase-orders\/([^/]+)\/receive$/,
    handler: ([id], config) => {
      const po = collections.purchaseOrders.find(id);
      if (!po) return { status: 404, body: { success: false, message: "Purchase order not found." } };

      (config.data?.items || []).forEach((item) => {
        const product = item.productId ? collections.products.find(item.productId) : null;
        if (!product) return;
        const newStock = product.stock + Number(item.quantity ?? 0);
        collections.products.patch(item.productId, {
          stock: newStock,
          status: deriveStatus(newStock, product.lowStockThreshold),
          updatedAt: new Date().toISOString(),
        });
      });

      const updated = collections.purchaseOrders.patch(id, { status: "Received" });
      return ok(updated);
    },
  },
  {
    method: "delete",
    pattern: /^\/purchase-orders\/([^/]+)$/,
    handler: ([id]) => {
      collections.purchaseOrders.remove(id);
      return ok(true);
    },
  },

  { method: "get", pattern: /^\/expenses\/categories$/, handler: () => ok(collections.expenseCategories.list()) },
  {
    method: "post",
    pattern: /^\/expenses\/categories$/,
    handler: (params, config) => {
      const record = { id: generateId(), name: (config.data?.name || "").trim() };
      return created(collections.expenseCategories.insert(record));
    },
  },
  { method: "get", pattern: /^\/expenses$/, handler: () => ok(collections.expenses.list()) },
  {
    method: "post",
    pattern: /^\/expenses$/,
    handler: (params, config) => {
      const payload = config.data || {};
      const category = collections.expenseCategories.find(payload.expenseCategoryId);

      const record = {
        id: generateId(),
        date: payload.expenseDate,
        description: payload.description,
        category: category ? category.name : "",
        supplierId: payload.supplierId || null,
        supplierName: lookupSupplierName(payload.supplierId),
        amount: Number(payload.amount ?? 0),
        paymentMethod: payload.paymentMethod,
        receiptUrl: payload.receiptUrl || "",
      };

      return created(collections.expenses.insert(record));
    },
  },
  {
    method: "patch",
    pattern: /^\/expenses\/([^/]+)$/,
    handler: ([id], config) => {
      const payload = config.data || {};
      const category = payload.expenseCategoryId
        ? collections.expenseCategories.find(payload.expenseCategoryId)
        : null;

      const patch = {
        description: payload.description,
        amount: Number(payload.amount ?? 0),
        paymentMethod: payload.paymentMethod,
        receiptUrl: payload.receiptUrl || "",
      };
      if (payload.expenseDate) patch.date = payload.expenseDate;
      if (category) patch.category = category.name;
      if (payload.supplierId !== undefined) {
        patch.supplierId = payload.supplierId;
        patch.supplierName = lookupSupplierName(payload.supplierId);
      }

      const updated = collections.expenses.patch(id, patch);
      if (!updated) return { status: 404, body: { success: false, message: "Expense not found." } };
      return ok(updated);
    },
  },
  {
    method: "delete",
    pattern: /^\/expenses\/([^/]+)$/,
    handler: ([id]) => {
      collections.expenses.remove(id);
      return ok(true);
    },
  },

  { method: "get", pattern: /^\/users$/, handler: () => ok(collections.users.list()) },
  { method: "get", pattern: /^\/roles$/, handler: () => ok(collections.roles.list()) },
  {
    method: "post",
    pattern: /^\/users$/,
    handler: (params, config) => {
      const payload = config.data || {};

      const record = {
        id: generateId(),
        fullName: payload.fullName,
        name: payload.fullName,
        email: payload.email,
        phone: payload.phone || "",
        role: lookupRole(payload.roleId),
        status: "Invited",
        lastLoginAt: null,
        avatarUrl: "",
        createdAt: new Date().toISOString(),
      };

      collections.users.insert(record);
      return created({ user: record, temporaryPassword: "Demo#1234" });
    },
  },
  {
    method: "patch",
    pattern: /^\/users\/([^/]+)$/,
    handler: ([id], config) => {
      const payload = config.data || {};
      const patch = { ...payload };
      if (payload.roleId !== undefined) patch.role = lookupRole(payload.roleId);

      const updated = collections.users.patch(id, patch);
      if (!updated) return { status: 404, body: { success: false, message: "User not found." } };
      return ok(updated);
    },
  },
  {
    method: "delete",
    pattern: /^\/users\/([^/]+)$/,
    handler: ([id]) => {
      collections.users.remove(id);
      return ok(true);
    },
  },
  {
    method: "post",
    pattern: /^\/users\/([^/]+)\/reset-password$/,
    handler: () => ok({ temporaryPassword: "Demo#1234" }),
  },

  {
    method: "get",
    pattern: /^\/notifications\/unread-count$/,
    handler: () => ok({ count: collections.notifications.list().filter((item) => !item.isRead).length }),
  },
  {
    method: "get",
    pattern: /^\/notifications$/,
    handler: (params, config) => {
      const limit = config.params?.limit ?? 8;
      const items = collections.notifications
        .list()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, limit);
      return ok({ items });
    },
  },
  {
    method: "patch",
    pattern: /^\/notifications\/([^/]+)\/read$/,
    handler: ([id]) => ok(collections.notifications.patch(id, { isRead: true })),
  },
  {
    method: "post",
    pattern: /^\/notifications\/read-all$/,
    handler: () => {
      collections.notifications.list().forEach((item) => {
        collections.notifications.patch(item.id, { isRead: true });
      });
      return ok({ message: "All notifications marked as read." });
    },
  },

  {
    method: "get",
    pattern: /^\/audit-logs\/meta$/,
    handler: () => ok({ actions: demoAuditMeta.actions, entityTypes: demoAuditMeta.entityTypes }),
  },
  {
    method: "get",
    pattern: /^\/audit-logs$/,
    handler: (params, config) => {
      const page = Number(config.params?.page ?? 1);
      const limit = Number(config.params?.limit ?? 25);

      let items = collections.auditLogs.list().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      if (config.params?.userId) {
        items = items.filter((item) => String(item.entityId) === String(config.params.userId));
      }
      if (config.params?.entityType) {
        items = items.filter((item) => item.entityType === config.params.entityType);
      }
      if (config.params?.action) {
        items = items.filter((item) => item.action === config.params.action);
      }

      const total = items.length;
      const totalPages = Math.max(Math.ceil(total / limit), 1);
      const start = (page - 1) * limit;
      const pageItems = items.slice(start, start + limit);

      return ok(pageItems, { total, totalPages, page, limit });
    },
  },

  { method: "get", pattern: /^\/settings\/business$/, handler: () => ok(singletons.businessSettings) },
  {
    method: "patch",
    pattern: /^\/settings\/business$/,
    handler: (params, config) => {
      singletons.businessSettings = { ...singletons.businessSettings, ...config.data };
      return ok(singletons.businessSettings);
    },
  },
  {
    method: "post",
    pattern: /^\/settings\/business\/logo$/,
    handler: (params, config) => {
      const file = typeof config.data?.get === "function" ? config.data.get("logo") : null;
      const logoUrl = file ? URL.createObjectURL(file) : singletons.businessSettings.logoUrl;
      singletons.businessSettings = { ...singletons.businessSettings, logoUrl };
      return ok(singletons.businessSettings);
    },
  },
  { method: "get", pattern: /^\/settings\/notifications$/, handler: () => ok(singletons.notificationPreferences) },
  {
    method: "patch",
    pattern: /^\/settings\/notifications$/,
    handler: (params, config) => {
      singletons.notificationPreferences = { ...singletons.notificationPreferences, ...config.data };
      return ok(singletons.notificationPreferences);
    },
  },

  {
    method: "get",
    pattern: /^\/permissions\/roles\/([^/]+)$/,
    handler: () => ok(singletons.roleMatrix.permissions),
  },
  {
    method: "put",
    pattern: /^\/permissions\/roles\/([^/]+)$/,
    handler: (params, config) => {
      singletons.roleMatrix = {
        ...singletons.roleMatrix,
        permissions: config.data?.matrix ?? singletons.roleMatrix.permissions,
      };
      return ok(singletons.roleMatrix.permissions);
    },
  },

  {
    method: "get",
    pattern: /^\/backups$/,
    handler: (params, config) => {
      const limit = config.params?.limit ?? 10;
      return ok(singletons.backups.slice(0, limit));
    },
  },
  {
    method: "post",
    pattern: /^\/backups$/,
    handler: () => {
      const record = {
        id: generateId(),
        createdAt: new Date().toISOString(),
        sizeLabel: "4.2 MB",
        createdBy: DEMO_USER.fullName,
      };
      singletons.backups = [record, ...singletons.backups];
      return created(record);
    },
  },
];

export function routeDemoRequest(config) {
  const method = (config.method || "get").toLowerCase();
  const rawUrl = config.url || "";
  const path = rawUrl.startsWith("http") ? new URL(rawUrl).pathname : rawUrl.split("?")[0];

  for (const route of routes) {
    if (route.method !== method) continue;

    const match = route.pattern.exec(path);
    if (!match) continue;

    try {
      return route.handler(match.slice(1), config);
    } catch {
      return { status: 500, body: { success: false, message: "Demo data error." } };
    }
  }

  if (method === "get") {
    return ok([]);
  }

  return ok({ message: "This action is simulated in Live Demo mode." });
}