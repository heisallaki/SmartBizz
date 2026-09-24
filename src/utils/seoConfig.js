export const SITE_NAME = "SmartBizzSystem";

export const SITE_URL = (
  import.meta.env.VITE_SITE_URL || "https://smart-bizz-system.vercel.app"
).replace(/\/$/, "");

export const DEFAULT_TITLE = `${SITE_NAME} — Business Management & POS for Kenyan SMEs`;

export const DEFAULT_DESCRIPTION =
  "SmartBizzSystem is a business management and point-of-sale platform for Kenyan small and medium businesses. Manage inventory, sales, invoicing, customers, suppliers, purchase orders, expenses, and reports in one place.";

export const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

export const SOFTWARE_APPLICATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: SITE_NAME,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description: DEFAULT_DESCRIPTION,
  url: `${SITE_URL}/login`,
};