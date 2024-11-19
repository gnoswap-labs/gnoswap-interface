import React from "react";
import Link from "next/link";

import { PrivacyLayoutWrapper } from "./PrivacyLayout.styles";

interface PrivacyLayoutProps {
  header: React.ReactNode;
  footer: React.ReactNode;
}

const PrivacyLayout = ({ header, footer }: PrivacyLayoutProps) => {
  return (
    <PrivacyLayoutWrapper>
      {header}
      <main>
        <section className="title-section">
          <h1>Privacy Policy</h1>
          <h2>Effective Date: Nov 29, 2024</h2>
        </section>

        <section className="article-section">
          <h3>1. Introduction</h3>
          <br />
          At GnoSwap Labs Inc., we respect and protect your privacy. This Privacy Policy explains how we collect, use,
          disclose, and protect your personal information when you access or use the GnoSwap platform. By using GnoSwap,
          you agree to the collection and use of your information in accordance with this policy. For the terms of use
          of the GnoSwap platform, please refer to{" "}
          <Link href={"/terms"} target={"_blank"}>
            Terms of Use
          </Link>
          .
          <br />
          <br />
          <h3>2. Definitions</h3>
          <br />
          <ul>
            <li>
              <b>&quot;Personal Data&quot;</b>: Any information that can directly or indirectly identify an individual,
              such as wallet addresses, transaction data, or IP addresses, depending on how they are used.
            </li>
            <li>
              <b>&quot;Processing&quot;</b>: Any operation performed on personal data, such as collection, storage, or
              sharing. &quot;Third-Party Services&quot;: External services or providers integrated with GnoSwap, such as
              wallets, bridges, or analytics services, that may collect or process personal data independently.
            </li>
            <li>
              <b>Third-Party Services&quot;</b>: External services or providers integrated with GnoSwap, such as
              wallets, bridges, or analytics services, that may collect or process personal data independently.
            </li>
          </ul>
          <br />
          <h3>3. Information We Collect</h3>
          <br />
          GnoSwap is a decentralized platform and does not directly collect any personally identifiable information
          (PII). However, we may collect certain information related to your interactions with the platform, including
          but not limited to:
          <br />
          <br />
          <ul>
            <li>
              <b>Public Blockchain Data</b>: Wallet addresses and transaction details related to your interactions on
              the gno.land blockchain. All transactions conducted via GnoSwap are publicly visible on the blockchain.
            </li>
            <li>
              <b>Technical Data</b>: IP addresses, browser types, operating system details, device identifiers, and
              session data, which may be collected through cookies or similar tracking technologies to enhance platform
              performance and security.
            </li>
            <li>
              <b>Usage Data</b>: Information related to your use of the GnoSwap platform, including transaction history,
              features accessed, and interaction metrics.
            </li>
            <li>
              <b>Cookies and Tracking Technologies</b>: We may use cookies, web beacons, and other tracking technologies
              to collect information about your interactions with our website and services. You can manage or disable
              cookies through your browser settings.
            </li>
          </ul>
          <br />
          <h3>4. How We Use Your Data</h3>
          <br />
          We process the data we collect for the following purposes:
          <br />
          <br />
          <ul>
            <li>
              <b>Platform Performance</b>: To provide and maintain GnoSwap services, ensuring smooth operation and
              functionality of the platform.
            </li>
            <li>
              <b>Security</b>: To monitor, detect, and prevent fraudulent activity, unauthorized access, and security
              threats to the platform.
            </li>
            <li>
              <b>Compliance with Legal Obligations</b>: To comply with applicable laws, including anti-money laundering
              (AML) regulations, counter-terrorism financing (CTF), and other legal or regulatory requirements.
            </li>
            <li>
              <b>Platform Improvements</b>: To analyze usage trends and interactions to improve the performance,
              features, and user experience of GnoSwap.
            </li>
          </ul>
          <br />
          <h3>5. Cookies and Tracking Technologies</h3>
          <br />
          GnoSwap uses cookies and similar tracking technologies to collect information related to your browsing
          activities. Cookies are small files stored on your device that help us understand how users engage with our
          platform. They help us:
          <br />
          <br />
          <ul>
            <li>
              <b>Improve Functionality</b>: Enhance the performance and functionality of the platform.
            </li>
            <li>
              <b>Analyze Usage</b>: Monitor user interactions to improve the user experience and optimize services.
            </li>
            <li>
              <b>Security</b>: Detect potentially malicious activities by tracking abnormal usage patterns.
            </li>
          </ul>
          <br />
          You may manage or disable cookies through your browser settings. However, disabling cookies may affect your
          ability to use certain features of the GnoSwap platform.
          <br />
          <br />
          <h3>6. How We Share Your Information</h3>
          <br />
          We do not sell, trade, or rent your personal information to third parties. However, we may share your data
          with the following entities in limited circumstances:
          <br />
          <br />
          <ul>
            <li>
              <b>Service Providers</b>: We may share data with trusted third-party service providers who assist us in
              operating our platform (e.g., analytics providers, and infrastructure providers). These third parties
              process data on our behalf and are required to maintain the confidentiality and security of your
              information.
            </li>
            <li>
              <b>Legal and Regulatory Authorities</b>: We may disclose your personal data to regulatory bodies or law
              enforcement agencies if required by law or necessary for compliance with legal obligations, including in
              response to valid subpoenas, court orders, or other legal processes.
            </li>
            <li>
              <b>Blockchain Network</b>: As a decentralized platform, all transactions conducted on GnoSwap are publicly
              visible on the gno.land blockchain and may be accessible to third parties.
            </li>
          </ul>
          <br />
          <h3>7. Data Breach Response</h3>
          <br />
          In the event of a data breach or security incident involving personal data, GnoSwap Labs Inc. will take
          immediate action to mitigate the breach, notify affected users, and inform the appropriate regulatory
          authorities. If you are affected by a breach, you will be informed within [X] hours/days of the discovery of
          the incident.
          <br />
          <br />
          <h3>8. Third-Party Services and Integrations</h3>
          <br />
          GnoSwap may integrate with third-party services such as wallet providers, data analytics platforms, and
          blockchain infrastructure. These third-party services operate independently, and their data processing
          practices are governed by their own privacy policies. We encourage users to review the privacy policies of
          these providers.
          <br />
          <br />
          <h3>9. User Control and Consent</h3>
          <br />
          You may control how GnoSwap collects and uses your data by managing your preferences for cookies and tracking
          technologies. You may also withdraw consent for non-essential data collection at any time by adjusting your
          browser settings or contacting us.
          <br />
          <br />
          <h3>10. Data Minimization and Anonymization</h3>
          <br />
          GnoSwap follows the principle of data minimization. We only collect and process the minimum amount of personal
          data necessary to provide and improve our services. Where possible, data is anonymized to further protect user
          privacy.
          <br />
          <br />
          <h3>11. International Data Transfers</h3>
          <br />
          Due to the decentralized and borderless nature of blockchain technology, your data may be transferred, stored,
          or processed in countries other than your own. GnoSwap Labs Inc. ensures that appropriate safeguards are in
          place to protect your data in compliance with applicable privacy laws. By using GnoSwap, you consent to the
          transfer of your information to countries outside of your jurisdiction.
          <br />
          <br />
          <ul>
            <li>
              <b>Safeguards</b>: In cases where personal data is transferred outside of the European Economic Area (EEA)
              or other regions with similar regulations, GnoSwap Labs Inc. uses appropriate safeguards such as standard
              contractual clauses to ensure data protection.
            </li>
          </ul>
          <br />
          <br />
          <h3>12. Data Retention</h3>
          <br />
          GnoSwap retains user data only as long as necessary to fulfill the purposes outlined in this Privacy Policy,
          including maintaining platform functionality, ensuring security, and complying with legal obligations.
          <br />
          <br />
          <ul>
            <li>
              <b>Blockchain Data</b>: All transactions recorded on the gno.land blockchain are permanent and immutable.
              This data cannot be modified or deleted once added to the blockchain.
            </li>
            <li>
              <b>Cookies and Session Data</b>: We retain cookies and session data only for the duration required to
              provide the services and analyze platform usage
            </li>
          </ul>
          <br />
          <h3>13. User Rights</h3>
          <br />
          Depending on your jurisdiction, you may have the following rights regarding your personal data:
          <br />
          <br />
          <ul>
            <li>
              <b>Right to Access</b>: You can request a copy of the personal data we hold about you.
            </li>
            <li>
              <b>Right to Rectification</b>: You can request the correction of inaccurate or incomplete information we
              hold about you.
            </li>
            <li>
              <b>Right to Deletion</b>: You can request the deletion of your personal data, where applicable, except for
              immutable blockchain data.
            </li>
            <li>
              <b>Right to Restrict Processing</b>: You can request to restrict the processing of your personal data.
            </li>
            <li>
              <b>Right to Object</b>: You have the right to object to the processing of your data under certain
              conditions.
            </li>
            <li>
              <b>Right to Object</b>: You have the right to object to the processing of your data under certain
              conditions.
            </li>
            <li>
              <b>Right to Data Portability</b>: You may request the transfer of your data to another service provider,
              where technically feasible.
            </li>
          </ul>
          <br />
          Please note that most data recorded on the blockchain is immutable, and we may be unable to modify or delete
          blockchain-based transactions.
          <br />
          <br />
          <h3>14. GDPR and International Compliance</h3>
          <br />
          If you are located in the European Economic Area (EEA) or other regions with similar data protection laws, you
          have certain rights under the General Data Protection Regulation (GDPR) or equivalent legislation:
          <br />
          <br />
          <ul>
            <li>
              <b>Lawful Basis for Processing</b>: Our legal basis for processing your personal data includes your
              consent, the necessity to provide the services, and compliance with legal obligations.
            </li>
            <li>
              <b>Data Subject Right</b>: You have the right to access, correct, and erase your personal data, as well as
              to restrict or object to its processing in accordance with the GDPR.
            </li>
            <li>
              <b>Filing Complaints</b>: You have the right to lodge a complaint with a data protection authority if you
              believe your rights under GDPR have been violated.
            </li>
          </ul>
          <br />
          GnoSwap Labs Inc. complies with the California Consumer Privacy Act (CCPA) and other applicable privacy laws
          where relevant.
          <br />
          <br />
          <h3>15. Data Security</h3>
          <br />
          We implement industry-standard security measures to protect your data from unauthorized access, alteration, or
          destruction. These measures include encryption, secure communication protocols (SSL/TLS), and restricted
          access controls. However, no security measures can guarantee absolute protection. You are responsible for
          maintaining the security of your wallet and private keys when using the GnoSwap platform.
          <br />
          <br />
          <h3>16. Children’s Privacy</h3>
          <br />
          GnoSwap does not knowingly collect or process personal information from individuals under the age of 18. If we
          discover that we have inadvertently collected personal data from a minor, we will take steps to delete the
          information as soon as possible.
          <br />
          <br />
          <h3>17. Regulatory and Law Enforcement Requests</h3>
          <br />
          GnoSwap Labs Inc. may be required to disclose personal data to regulatory authorities or law enforcement
          agencies in response to lawful requests. We will only provide the data that is necessary and will notify
          users, where legally permissible, of such requests.
          <br />
          <br />
          <h3>18. Data Processing Agreements</h3>
          <br />
          GnoSwap Labs Inc. has agreements in place with third-party service providers that process personal data on our
          behalf. These agreements ensure that these providers implement adequate data protection measures in compliance
          with applicable regulations.
          <br />
          <br />
          <h3>19. Right to Withdraw Consent</h3>
          <br />
          You have the right to withdraw your consent for data processing at any time. Withdrawing consent does not
          affect the legality of any processing carried out before the withdrawal.
          <br />
          <br />
          <h3>20. Changes to the Privacy Policy</h3>
          <br />
          GnoSwap Labs Inc. reserves the right to modify or update this Privacy Policy at any time. If significant
          changes are made, we will notify users through appropriate channels (e.g., website notification). Continued
          use of GnoSwap after changes are made implies acceptance of the updated policy.
          <br />
          <br />
          <h3>21. Contact Information</h3>
          <br />
          If you have any questions or comments about this Privacy Policy, please contact us by email:{" "}
          <Link href={"mailto:info@gnoswap.io"} target={"_blank"}>
            info@gnoswap.io
          </Link>
          .
        </section>
      </main>
      {footer}
    </PrivacyLayoutWrapper>
  );
};

export default PrivacyLayout;
