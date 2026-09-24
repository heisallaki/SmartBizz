import LegalPageLayout, { LegalSection } from "./components/LegalPageLayout";
import Seo from "../../components/common/Seo";

export default function TermsOfServicePage() {
  return (
    <>
      <Seo
        title="Terms of Service"
        description="The terms that govern your use of SmartBizzSystem, including Live Demo Mode, acceptable use, and account responsibilities."
        path="/terms-of-service"
      />

      <LegalPageLayout
      title="Terms of Service"
      subtitle="The terms that govern your use of SmartBizz."
      lastUpdated="September 2026"
    >
      <LegalSection heading="Acceptance of Terms">
        {`By accessing or using SmartBizz (the "Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
        `}

    </LegalSection>

      <LegalSection heading="Description of Service">
        SmartBizz is a business management platform that helps businesses manage inventory, sales, invoicing, customers, suppliers, purchase orders, expenses, and reporting.
      </LegalSection>

      <LegalSection heading="Live Demo Mode">
        {`Live Demo Mode is provided for evaluation purposes only, requires no account, and uses sample data that exists solely in your browser for the duration of your session. Data entered in Live Demo Mode is not saved, is not backed up, and is cleared when you exit the demo or refresh the page. Live Demo Mode is provided "as is" with no guarantee of uptime or data retention, since none is intended.`}
      </LegalSection>

      <LegalSection heading="Accounts & Responsibilities">
        {`If you are given access to a real SmartBizz account, you are responsible for:

- Keeping your login credentials confidential
- All activity that occurs under your account
- Ensuring the accuracy of the business data you enter

You should notify your administrator promptly if you suspect unauthorized use of your account.`}
      </LegalSection>

      <LegalSection heading="Acceptable Use">
        {`You agree not to:

- Use the Service for any unlawful purpose
- Attempt to gain unauthorized access to another account or to SmartBizz's systems
- Interfere with or disrupt the integrity or performance of the Service
- Upload data you do not have the right to store or process`}
      </LegalSection>

      <LegalSection heading="Your Data">
        Business data you enter into a real SmartBizz account belongs to you or your business. We do not claim ownership of your business data and use it only to provide the Service to you, as described in our Privacy Policy.
      </LegalSection>

      <LegalSection heading="Intellectual Property">
        The SmartBizz name, interface, and underlying software are the property of their respective owner(s) and are protected by applicable intellectual property laws. These Terms do not grant you any rights to SmartBizz's trademarks, branding, or source code beyond what is necessary to use the Service.
      </LegalSection>

      <LegalSection heading="Disclaimers">
        The Service is provided "as is" and "as available" without warranties of any kind, whether express or implied. We do not warrant that the Service will be uninterrupted, error-free, or completely secure.
      </LegalSection>

      <LegalSection heading="Limitation of Liability">
        To the fullest extent permitted by law, SmartBizz and its developer(s) shall not be liable for any indirect, incidental, or consequential damages arising from your use of, or inability to use, the Service.
      </LegalSection>

      <LegalSection heading="Termination">
        We may suspend or terminate access to the Service for any account that violates these Terms. You may stop using the Service at any time.
      </LegalSection>

      <LegalSection heading="Changes to These Terms">
        We may update these Terms from time to time. The "Last updated" date at the top of this page reflects the most recent revision. Continued use of the Service after changes take effect constitutes acceptance of the revised Terms.
      </LegalSection>

      <LegalSection heading="Governing Law">
        These Terms are governed by the laws of the Republic of Kenya, without regard to its conflict of law principles, unless otherwise required by applicable local law.
      </LegalSection>

      <LegalSection heading="Contact">
        {`Questions about these Terms can be sent to:

kal.projects.dev@gmail.com`}
      </LegalSection>
      </LegalPageLayout>
    </>
  );
}