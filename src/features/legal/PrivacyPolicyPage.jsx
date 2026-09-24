import LegalPageLayout, { LegalSection } from "./components/LegalPageLayout";
import Seo from "../../components/common/Seo";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Seo
        title="Privacy Policy"
        description="How SmartBizzSystem collects, uses, and protects your information, including data handling in Live Demo Mode."
        path="/privacy-policy"
      />

      <LegalPageLayout
      title="Privacy Policy"
      subtitle="How SmartBizz collects, uses, and protects your information."
      lastUpdated="September 2026"
    >
      <LegalSection heading="Introduction">
        {`This Privacy Policy explains how SmartBizz handles information when you use the SmartBizz application (the "Service"). It applies to registered business accounts as well as visitors using Live Demo Mode.
        `}
      </LegalSection>

      <LegalSection heading="Information We Collect">
        {  `Account information - such as your name, email address, phone number, and role, provided when an account is created for you.
            Business data you enter - including products, customers, sales, invoices, suppliers, purchase orders, and expenses that you or your team add to the platform.
            Usage data - basic technical information such as browser type and general usage patterns, used to keep the Service reliable.
            Live Demo data - when you use Live Demo Mode, any sample data you create exists only in your browser's memory for that session. It is never transmitted to or stored on our servers.`
        }
      </LegalSection>

      <LegalSection heading="How We Use Your Information">
        {`We use the information collected to:

- Provide, operate, and maintain the Service
- Authenticate accounts and enforce role-based access
- Generate reports, summaries, and analytics within your own account
- Respond to support requests
- Improve the reliability and usability of SmartBizz

We do not sell your information or your business data to third parties.`}
      </LegalSection>

      <LegalSection heading="Data Storage & Security">
        Business data you enter into a real SmartBizz account is stored on our backend servers and associated database. We apply reasonable technical safeguards, including authenticated API access and role-based permissions, to help protect this information. No method of storage or transmission is completely secure, and we cannot guarantee absolute security.
      </LegalSection>

      <LegalSection heading="Local Storage & Cookies">
        SmartBizz uses your browser's local storage to remember your session, theme preference (Light, Dark, or System), accent color, and layout density. These values stay on your device and are used only to personalize your experience — they are not used for advertising or third-party tracking.
      </LegalSection>

      <LegalSection heading="Data Sharing">
        We do not share your business data with third parties except where necessary to operate the Service (for example, hosting infrastructure) or where required by law. Each business account's data is logically separated from other accounts.
      </LegalSection>

      <LegalSection heading="Your Rights">
        {`Depending on your role and applicable local law, you may be able to:

- Access or correct the information associated with your account
- Request deletion of your account or business data
- Ask questions about how your information is handled

You can exercise any of these rights by contacting us using the details below.`}
      </LegalSection>

      <LegalSection heading="Children's Privacy">
        SmartBizz is intended for business use and is not directed at children. We do not knowingly collect personal information from children.
      </LegalSection>

      <LegalSection heading="Changes to This Policy">
        We may update this Privacy Policy from time to time. The "Last updated" date at the top of this page reflects the most recent revision.
      </LegalSection>

      <LegalSection heading="Contact Us">
        {`If you have any questions about this Privacy Policy, please contact:

kal.projects.dev@gmail.com`}
      </LegalSection>
      </LegalPageLayout>
    </>
  );
}