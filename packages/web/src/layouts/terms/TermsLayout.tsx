import React from "react";
import Link from "next/link";

import { TermsLayoutWrapper } from "./TermsLayout.styles";

interface PrivacyLayoutProps {
  header: React.ReactNode;
  footer: React.ReactNode;
}

const TermsLayout = ({ header, footer }: PrivacyLayoutProps) => {
  return (
    <TermsLayoutWrapper>
      {header}
      <main>
        <section className="title-section">
          <h1>Terms of Use</h1>
          <h2>Effective Date: Nov 29, 2024</h2>
        </section>

        <section className="article-section">
          <h3>1. Introduction</h3>
          <br />
          Welcome to GnoSwap, a decentralized application (DApp) built on the gno.land blockchain. GnoSwap is a
          decentralized application (DApp) built on the gno.land blockchain. <b>GnoSwap Labs Inc.</b>, a company
          established in Panama, provides and maintains the platform interface but the core parts of the GnoSwap
          service, such as smart contracts and governance, are controlled by the decentralized community of GNS token
          holders through DAO governance. By accessing or using GnoSwap (
          <Link href={"/"} target={"_blank"}>
            https://gnoswap.io/
          </Link>
          ), you agree to comply with these Terms of Use. If you do not agree to these terms, you must discontinue using
          GnoSwap.
          <br />
          <br />
          <h3>2. Definitions</h3>
          <br />
          <ul>
            <li>
              <b>&quot;Digital Assets&quot;</b>: Cryptocurrencies, tokens, or other digital representations of value
              that can be transferred, traded, or used within the GnoSwap platform.
            </li>
            <li>
              <b>&quot;User&quot;</b>: Any individual or entity that accesses, interacts with, or utilizes GnoSwap
              services, including staking, swapping, and governance participation.
            </li>
            <li>
              <b>&quot;Smart Contracts&quot;</b>: Self-executing contracts where the terms are written into code and
              automatically enforced on the gno.land blockchain.
            </li>
            <li>
              <b>&quot;DAO&quot;</b>: Decentralized Autonomous Organization; the mechanism by which GNS token holders
              propose, vote on, and implement changes to GnoSwap governance and operations.
            </li>
            <li>
              <b>&quot;Staking&quot;</b>: The act of locking digital assets in smart contracts to participate in
              governance or earn rewards.
            </li>
            <li>
              <b>&quot;Liquidity Pool&quot;</b>: A smart contract where users can deposit assets to provide liquidity to
              the GnoSwap platform in return for potential rewards or fees.
            </li>
            <li>
              <b>&quot;Impermanent Loss&quot;</b>: A potential loss incurred by liquidity providers due to the relative
              volatility between assets in the liquidity pool.
            </li>
            <li>
              <b>&quot;Slippage&quot;</b>: The difference between the expected price of a trade and the actual price
              executed due to market movement.
            </li>
          </ul>
          <br />
          <h3>3. User Eligibility</h3>
          <br />
          By using GnoSwap, you confirm that you are at least 18 years of age and have the legal capacity to enter into
          agreements in your jurisdiction. You are solely responsible for ensuring that your use of GnoSwap complies
          with all applicable laws and regulations, including those related to digital assets, financial services, and
          taxation.
          <br />
          <br />
          <h3>4. Platform Use and Role</h3>
          <br />
          GnoSwap is a decentralized platform where GnoSwap Labs Inc. provides only the interface. The actual operations
          of the platform, including transaction execution, staking, liquidity provision, and governance, are managed
          through smart contracts on the gno.land blockchain and controlled by the decentralized community of GNS token
          holders.
          <br />
          <br />
          <ul>
            <li>
              <b>No Custody</b>: GnoSwap Labs Inc. does not custody any user funds or assets, and users are fully
              responsible for managing their private keys and wallet security.
            </li>
            <li>
              <b>No Control Over Transactions</b>: Once submitted, all transactions on GnoSwap are irreversible and
              beyond the control of GnoSwap Labs Inc. Ensure all details are correct before confirming transactions.
            </li>
          </ul>
          <br />
          <br />
          <h3>5. Prohibited Activities</h3>
          <br />
          You agree not to use GnoSwap for any illegal, unauthorized, or unethical activities, including but not limited
          to:
          <br />
          <br />
          <ul>
            <li>
              <b>Unlawful Use</b>: Using GnoSwap in a manner that violates applicable laws, including anti-money
              laundering (AML), counter-terrorism financing, and sanctions compliance laws.{" "}
            </li>
            <li>
              <b>Exploitation or Hacking</b>: Attempting to exploit, hack, manipulate, or otherwise tamper with the
              smart contracts, protocols, or software that powers GnoSwap.
            </li>
            <li>
              <b>Infringement</b>: Violating the intellectual property rights of GnoSwap Labs Inc. or any third party.
            </li>
            <li>
              <b>Fraud</b>: Engaging in fraudulent activities, including but not limited to pump-and-dump schemes,
              front-running, or wash trading.
            </li>
          </ul>
          <br />
          GnoSwap Labs Inc. reserves the right to suspend or terminate access to the platform for violations of these
          terms.
          <br />
          <br />
          <h3>6. Intellectual Property</h3>
          <br />
          All intellectual property on the GnoSwap platform, including the software code, logos, design elements, and
          documentation, is owned by GnoSwap Labs Inc. or licensed to it. Users are not granted any rights or licenses
          to use the intellectual property except as expressly allowed under these terms. Any unauthorized use,
          reproduction, or distribution of content is prohibited.
          <br />
          <br />
          <h3>7. User Responsibilities</h3>
          <br />
          As a user of GnoSwap, you acknowledge and agree that:
          <br />
          <br />
          <ul>
            <li>
              <b>Wallet and Key Management</b>: You are solely responsible for managing your private keys, seed phrases,
              and other authentication credentials. GnoSwap Labs Inc. has no access to your keys and cannot recover lost
              assets due to key mismanagement.
            </li>
            <li>
              <b>Transaction Verification</b>: All transactions are final once executed on the blockchain. You must
              verify the accuracy of transaction details, including the destination address, gas fees, and amounts
              before confirming any transaction.
            </li>
            <li>
              <b>Compliance with Laws</b>: You are responsible for ensuring that your use of GnoSwap complies with all
              applicable laws in your jurisdiction, including tax obligations and regulations concerning digital assets.
            </li>
          </ul>
          <br />
          <br />
          <h3>8. Risk Assumption</h3>
          <br />
          By using GnoSwap, you acknowledge the inherent risks of interacting with decentralized finance (DeFi)
          applications and blockchain technology, including but not limited to:
          <br />
          <br />
          <ul>
            <li>
              <b>Market Volatility</b>: The value of digital assets can fluctuate significantly, and you may experience
              financial loss.
            </li>
            <li>
              <b>Smart Contract Risks</b>: Smart contracts may contain bugs, vulnerabilities, or be subject to
              exploitation. GnoSwap Labs Inc. does not guarantee the security or functionality of any third-party smart
              contracts.
            </li>
            <li>
              <b>Liquidity Risks</b>: Providing liquidity to the GnoSwap platform may expose you to impermanent loss,
              which can occur due to price changes between the deposited assets.
            </li>
            <li>
              <b>Slippage Risks</b>: When swapping assets, the price may change between the time of initiating and
              executing the trade, leading to slippage and potentially less favorable trading outcomes.
            </li>
            <li>
              <b>Governance Risks</b>: Changes to the GnoSwap platform’s functionality or policies may be decided
              through the DAO by GNS token holders, which could impact your user experience or holdings.
            </li>
            <li>
              <b>Staking Risks</b>: Staking rewards are not guaranteed and may be impacted by market conditions,
              governance decisions, or platform performance. Staked assets may be subject to lock-up periods, and early
              withdrawal may result in penalties.
            </li>
          </ul>
          <br />
          For more detailed information about Risk, please refer to our{" "}
          <Link href={"https://docs.gnoswap.io/references/notice/risk"} target={"_blank"}>
            Risk & Security notice
          </Link>
          .
          <br />
          <br />
          <h3>9. Staking and Liquidity Provision</h3>
          <br />
          Users may choose to stake digital assets or provide liquidity to the platform to earn rewards. However, these
          activities involve risk, and rewards are not guaranteed:
          <br />
          <br />
          <ul>
            <li>
              Staking: Staking involves locking your assets in the protocol (smart contracts), and the value of staked
              assets may fluctuate. You may not be able to withdraw staked assets immediately, and penalties may apply
              to early withdrawals.
            </li>
            <li>
              Liquidity Provision: By providing liquidity, you may earn transaction fees, but you are also exposed to
              the risk of impermanent loss if the value of the assets changes relative to each other. GnoSwap does not
              guarantee the safety or profitability of liquidity provision.
            </li>
          </ul>
          <br />
          <h3>10. Anti-Money Laundering (AML) and Identity Verification</h3>
          <br />
          GnoSwap may require users to complete identity verification (Know Your Customer - KYC) procedures to comply
          with anti-money laundering (AML) regulations. GnoSwap reserves the right to suspend services or terminate
          accounts if illegal activities or AML violations are suspected.
          <br />
          <br />
          <ul>
            <li>
              Regulatory Compliance: GnoSwap Labs Inc. complies with applicable international regulations, and may
              provide user information to regulatory authorities upon lawful request. GnoSwap will cooperate with
              regulators in line with AML and counter-terrorism financing requirements.
            </li>
          </ul>
          <br />
          <h3>11. Indemnification</h3>
          <br />
          You agree to indemnify and hold harmless GnoSwap Labs Inc., its affiliates, officers, directors, employees,
          and agents from and against any and all claims, damages, losses, or expenses (including legal fees) arising
          from:
          <br />
          <br />
          <ul>
            <li>Your use of GnoSwap.</li>
            <li>Your violation of these Terms of Use.</li>
            <li>Your violation of any third-party rights or applicable laws.</li>
          </ul>
          <br />
          <h3>12. No Warranty Disclaimer</h3>
          <br />
          GnoSwap is provided &quot;as is&quot; and &quot;as available&quot; without any warranties, express or implied,
          including warranties of merchantability, fitness for a particular purpose, or non-infringement. GnoSwap Labs
          Inc. does not guarantee that the platform will be available, secure, or free from bugs, errors, or
          vulnerabilities.
          <br />
          <br />
          <h3>13. Limitation of Liability</h3>
          <br />
          To the fullest extent permitted by law, GnoSwap Labs Inc. and its affiliates, directors, officers, employees,
          or agents shall not be liable for any direct, indirect, incidental, special, or punitive damages, including:
          <br />
          <br />
          <ul>
            <li>Loss of profits, digital assets, data, or business opportunities.</li>
            <li>Damage arising from unauthorized access to or use of your wallet or private keys.</li>
            <li>Loss or corruption of data due to third-party service failures or platform bugs.</li>
          </ul>
          <br />
          <h3>14. Force Majeure</h3>
          <br />
          GnoSwap Labs Inc. will not be liable for any delays or failures caused by circumstances beyond its reasonable
          control, including natural disasters, regulatory changes, cyberattacks, and service interruptions from
          third-party providers.
          <br />
          <br />
          <h3>15. Third-Party Services</h3>
          <br />
          GnoSwap integrates with third-party services, including wallets, bridges, and blockchain networks. GnoSwap
          Labs Inc. is not responsible for the performance or security of these services. You are encouraged to review
          their terms and privacy policies before using them.
          <br />
          <br />
          <h3>16. Termination and Suspension</h3>
          <br />
          GnoSwap Labs Inc. reserves the right to suspend or terminate access to the platform for any user who violates
          these terms or if GnoSwap Labs Inc. determines that it is necessary for legal, security, or operational
          reasons. Termination may occur with or without prior notice.
          <br />
          <br />
          <h3>17. Governing Law and Dispute Resolution</h3>
          <br />
          These Terms of Use are governed by the laws of Panama. In the event of a dispute, users agree to resolve the
          matter through binding arbitration conducted in accordance with the rules of the jurisdiction of Panama. Users
          waive their right to participate in class-action lawsuits.
          <br />
          <br />
          <h3>18. Tax and Legal Compliance</h3>
          <br />
          Users are solely responsible for reporting, calculating, and paying any taxes applicable to the use of GnoSwap
          services, including the acquisition, sale, or staking of digital assets. GnoSwap Labs Inc. does not provide
          tax advice and encourages users to consult with tax professionals.
          <br />
          <br />
          <ul>
            <li>
              International Regulatory Compliance: GnoSwap Labs Inc. complies with applicable international regulations
              and may be required to report user activity to regulatory authorities as required by law.
            </li>
          </ul>
          <br />
          <h3>19. Amendments to the Terms</h3>
          <br />
          GnoSwap Labs Inc. reserves the right to modify or update these Terms of Use at any time. Users will be
          notified of significant changes, and continued use of the platform implies acceptance of the updated terms.
          <br />
          <br />
          <h3>20. Contact Information</h3>
          <br />
          If you have any questions or comments about your use of GnoSwap, you may contact us by email:{" "}
          <Link href={"mailto:info@gnoswap.io"}>info@gnoswap.io</Link>.
        </section>
      </main>
      {footer}
    </TermsLayoutWrapper>
  );
};

export default TermsLayout;
