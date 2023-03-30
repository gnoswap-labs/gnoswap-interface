import React from "react";
import { wrapper } from "./TokenLayout.styles";

interface TokenLayoutProps {
  header: React.ReactNode;

  breadcrumbs: React.ReactNode;

  chart: React.ReactNode;
  info: React.ReactNode;
  description: React.ReactNode;

  swap: React.ReactNode;
  bestPools: React.ReactNode;
  trending: React.ReactNode;
  gainersAndLosers: React.ReactNode;

  footer: React.ReactNode;
}

const TokenLayout: React.FC<TokenLayoutProps> = ({
  header,

  breadcrumbs,
  chart,
  info,
  description,

  swap,
  bestPools,
  trending,
  gainersAndLosers,

  footer,
}) => (
  <div css={wrapper}>
    {header}

    <div className="title-container">
      <div className="title">Swap</div>
      <div className="breadcrumbs">{breadcrumbs}</div>
    </div>

    <div className="main-container">
      <div className="main-section">
        <div className="chart">{chart}</div>
        <div className="info">{info}</div>
        <div className="description">{description}</div>
      </div>
      <div className="right-section">
        <div className="swap">{swap}</div>
        <div className="best-pools">{bestPools}</div>
        <div className="trending">{trending}</div>
        <div className="gainers-losers">{gainersAndLosers}</div>
      </div>
    </div>

    {footer}
  </div>
);

export default TokenLayout;
