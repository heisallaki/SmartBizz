import { lazy } from "react";

export const LoginPage = lazy(() => import("../features/auth/pages/LoginPage"));
export const DashboardPage = lazy(() => import("../features/dashboard/DashboardPage"));
export const InventoryPage = lazy(() => import("../features/inventory/InventoryPage"));
export const SalesPage = lazy(() => import("../features/sales/SalesPage"));
export const CustomersPage = lazy(() => import("../features/customers/CustomersPage"));
export const InvoicesPage = lazy(() => import("../features/invoices/InvoicesPage"));
export const SuppliersPage = lazy(() => import("../features/suppliers/SuppliersPage"));
export const PurchaseOrdersPage = lazy(() => import("../features/purchase-orders/PurchaseOrdersPage"));
export const ExpensesPage = lazy(() => import("../features/expenses/ExpensesPage"));
export const ReportsPage = lazy(() => import("../features/reports/ReportsPage"));
export const SettingsPage = lazy(() => import("../features/settings/SettingsPage"));
export const UsersPage = lazy(() => import("../features/users/UsersPage"));
export const AuditLogPage = lazy(() => import("../features/audit-log/AuditLogPage"));
export const NotFoundPage = lazy(() => import("../features/not-found/NotFoundPage"));