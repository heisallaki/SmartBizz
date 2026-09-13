import { Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

import AppLayout from "../components/layout/AppLayout";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";
import FullPageLoader from "../components/common/FullPageLoader";

import {
  LoginPage,
  DashboardPage,
  InventoryPage,
  SalesPage,
  CustomersPage,
  InvoicesPage,
  SuppliersPage,
  PurchaseOrdersPage,
  ExpensesPage,
  ReportsPage,
  SettingsPage,
  UsersPage,
  AuditLogPage,
  DocumentationPage,
  PrivacyPolicyPage,
  TermsOfServicePage,
  NotFoundPage,
} from "./lazyRoutes";

import ROLES from "../constants/roles";

const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <Suspense fallback={<FullPageLoader />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: "/documentation",
    element: (
      <Suspense fallback={<FullPageLoader />}>
        <DocumentationPage />
      </Suspense>
    ),
  },
  {
    path: "/privacy-policy",
    element: (
      <Suspense fallback={<FullPageLoader />}>
        <PrivacyPolicyPage />
      </Suspense>
    ),
  },
  {
    path: "/terms-of-service",
    element: (
      <Suspense fallback={<FullPageLoader />}>
        <TermsOfServicePage />
      </Suspense>
    ),
  },
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "inventory", element: <InventoryPage /> },
      { path: "sales", element: <SalesPage /> },
      { path: "customers", element: <CustomersPage /> },
      { path: "invoices", element: <InvoicesPage /> },
      { path: "reports", element: <ReportsPage /> },
      { path: "settings", element: <SettingsPage /> },
      {
        path: "suppliers",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
            <SuppliersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "purchase-orders",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
            <PurchaseOrdersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "expenses",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
            <ExpensesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "users",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <UsersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "audit-log",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <AuditLogPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<FullPageLoader />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
]);

export default router;