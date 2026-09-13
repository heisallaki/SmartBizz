import LegalPageLayout, { LegalSection } from "./components/LegalPageLayout";

export default function DocumentationPage() {
  return (
    <LegalPageLayout
      title="Documentation"
      subtitle="A quick guide to getting the most out of SmartBizz."
      lastUpdated="September 2026"
    >
      <LegalSection heading="What is SmartBizz?">
        SmartBizz is an all-in-one business management platform built for small and growing businesses. It brings inventory, sales, invoicing, customers, suppliers, purchase orders, expenses, and reporting into a single, easy-to-use workspace.
      </LegalSection>

      <LegalSection heading="Getting Started">
        {`If your business already uses SmartBizz, sign in from the login page with the email and password provided by your administrator.

If you are exploring SmartBizz for the first time, click "Try Live Demo" on the login page. No account or credentials are required, and you can freely add, edit, and delete records without affecting anyone else's data.`}
      </LegalSection>

      <LegalSection heading="Core Modules">
        {`Dashboard - An at-a-glance view of revenue, sales, customers, and low-stock alerts.
Inventory - Manage products, categories, stock levels, and pricing.
Sales - Record sales transactions and track payment status.
Customers - Maintain customer profiles, order history, and balances.
Invoices - Generate invoices, record payments, and track amounts due.
Suppliers - Keep a directory of suppliers and their order history.
Purchase Orders - Create, submit, approve, and receive purchase orders.
Expenses - Track day-to-day business expenses by category.
Reports - Review revenue, inventory, and customer trends over time.
Users & Roles - Manage staff accounts and what each role can access.
Audit Log - See a chronological record of important actions taken in the account.`}
      </LegalSection>

      <LegalSection heading="Roles & Permissions">
        {`SmartBizz ships with three roles out of the box:

Admin - Full access to every module, including Users, Audit Log, and role permissions.
Manager - Access to day-to-day operational modules such as Inventory, Sales, Suppliers, Purchase Orders, and Expenses.
Cashier - Access focused on Sales and Customers for front-of-house staff.

An Admin can fine-tune exactly what each role can view, create, edit, or delete from Settings under "User & Security".`}
      </LegalSection>

      <LegalSection heading="Live Demo Mode">
        The Live Demo runs entirely in your browser using sample data. No demo activity ever reaches SmartBizz's real servers or affects any real account, and nothing you do in the demo is saved once you refresh the page or exit. It is meant purely to let you explore the interface risk-free.
      </LegalSection>

      <LegalSection heading="Appearance & Theming">
        From Settings, you can switch between Light, Dark, and System theme modes, choose an accent color, and adjust layout density. These preferences are stored on your device and apply immediately across the app.
      </LegalSection>

      <LegalSection heading="Need More Help?">
        {`If you run into an issue or have a question that isn't covered here, reach out any time at kal.projects.dev@gmail.com.`}
      </LegalSection>
    </LegalPageLayout>
  );
}