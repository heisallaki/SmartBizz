import {
  demoAuditLogs,
  demoBackups,
  demoBusinessSettings,
  demoCategories,
  demoCustomers,
  demoExpenseCategories,
  demoExpenses,
  demoInvoices,
  demoNotificationPreferences,
  demoNotifications,
  demoProducts,
  demoPurchaseOrders,
  demoRoleMatrix,
  demoRoles,
  demoSales,
  demoSuppliers,
  demoUsers,
} from "./demoFixtures";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function createCollection(seed, idField = "id") {
  let items = clone(seed);

  return {
    idField,
    list() {
      return clone(items);
    },
    find(id) {
      const item = items.find((entry) => String(entry[idField]) === String(id));
      return item ? clone(item) : null;
    },
    insert(record) {
      items = [...items, record];
      return clone(record);
    },
    patch(id, updates) {
      let updated = null;

      items = items.map((entry) => {
        if (String(entry[idField]) === String(id)) {
          updated = { ...entry, ...updates, [idField]: entry[idField] };
          return updated;
        }
        return entry;
      });

      return updated ? clone(updated) : null;
    },
    remove(id) {
      const before = items.length;
      items = items.filter((entry) => String(entry[idField]) !== String(id));
      return items.length < before;
    },
    reset() {
      items = clone(seed);
    },
  };
}

export const collections = {
  categories: createCollection(demoCategories),
  suppliers: createCollection(demoSuppliers),
  products: createCollection(demoProducts),
  customers: createCollection(demoCustomers, "customerCode"),
  sales: createCollection(demoSales),
  invoices: createCollection(demoInvoices),
  purchaseOrders: createCollection(demoPurchaseOrders),
  expenseCategories: createCollection(demoExpenseCategories),
  expenses: createCollection(demoExpenses),
  users: createCollection(demoUsers),
  roles: createCollection(demoRoles),
  notifications: createCollection(demoNotifications),
  auditLogs: createCollection(demoAuditLogs),
};

export const singletons = {
  businessSettings: clone(demoBusinessSettings),
  notificationPreferences: clone(demoNotificationPreferences),
  roleMatrix: clone(demoRoleMatrix),
  backups: clone(demoBackups),
};

let nextId = 9000;

export function generateId() {
  nextId += 1;
  return nextId;
}

export function generateCode(prefix) {
  nextId += 1;
  return `${prefix}-${nextId}`;
}

export function resetDemoStore() {
  Object.values(collections).forEach((collection) => collection.reset());
  singletons.businessSettings = clone(demoBusinessSettings);
  singletons.notificationPreferences = clone(demoNotificationPreferences);
  singletons.roleMatrix = clone(demoRoleMatrix);
  singletons.backups = clone(demoBackups);
  nextId = 9000;
}