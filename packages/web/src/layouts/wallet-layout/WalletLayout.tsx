import React from "react";
import { wrapper } from "./WalletLayout.styles";

interface WalletLayoutProps {
  header: React.ReactNode;
  balance: React.ReactNode;
  assets: React.ReactNode;
  positions: React.ReactNode;
  footer: React.ReactNode;
}

const WalletLayout: React.FC<WalletLayoutProps> = ({
  header,
  balance,
  assets,
  positions,
  footer,
}) => (
  <main css={wrapper}>
    {header}

    <section className="wallet-summary-section">
      <div className="container title-container">
        <h3 className="title">Wallet</h3>
      </div>
      <div className="container balance-container">{balance}</div>
    </section>

    <div className="background-wrapper">
      <div className="background"></div>
      <section className="wallet-detail-section">
        <div className="container assets-container">{assets}</div>
        <div className="container positions-container">{positions}</div>
      </section>
    </div>

    {footer}
  </main>
);

export default WalletLayout;
