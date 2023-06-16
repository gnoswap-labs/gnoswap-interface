import React from "react";
import { wrapper } from "./EarnLayout.styles";

interface WalletLayoutProps {
  header: React.ReactNode;
  positions: React.ReactNode;
  incentivizedPools: React.ReactNode;
  poolList: React.ReactNode;
  footer: React.ReactNode;
}

const EarnLayout: React.FC<WalletLayoutProps> = ({
  header,
  positions,
  incentivizedPools,
  poolList,
  footer,
}) => (
  <div css={wrapper}>
    {header}
    <main className="earn-content">
      <div className="earn-wrap">
        <h3 className="earn-title">Earn</h3>
        <section className="position-section">{positions}</section>
        <section className="incentivized-section">{incentivizedPools}</section>
      </div>
      <div className="pools-wrap">
        <section className="pools-section">{poolList}</section>
        <div className="gradient-bg" />
      </div>
    </main>

    {footer}
  </div>
);

export default EarnLayout;
