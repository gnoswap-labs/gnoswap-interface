import React from "react";
import { wrapper } from "./PoolLayout.styles";

interface PoolLayoutProps {
  header: React.ReactNode;
  breadcrumbs: React.ReactNode;
  poolPairInformation: React.ReactNode;
  liquidity: React.ReactNode;
  staking: React.ReactNode;
  addIncentive: React.ReactNode;
  footer: React.ReactNode;
}

const PoolLayout: React.FC<PoolLayoutProps> = ({
  header,
  breadcrumbs,
  poolPairInformation,
  liquidity,
  staking,
  addIncentive,
  footer,
}) => (
  <div css={wrapper}>
    {header}
    <main className="pool-content">
      <div className="title-container">
        <h3 className="pool-title">Earn</h3>
        <div className="breadcrumbs">{breadcrumbs}</div>
      </div>
      <section className="pool-pair-section">{poolPairInformation}</section>
      <section className="liquidity-section">{liquidity}</section>
      <section className="staking-section">{staking}</section>
      <section className="add-incentive-section">{addIncentive}</section>
    </main>
    {footer}
  </div>
);

export default PoolLayout;
