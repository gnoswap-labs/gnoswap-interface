import React from "react";
import { wrapper } from "./StakeLiquidityLayout.styles";

interface StakeLiquidityLayoutProps {
  header: React.ReactNode;
  breadcrumbs: React.ReactNode;
  stakeLiquidity: React.ReactNode;
  footer: React.ReactNode;
}

const StakeLiquidityLayout: React.FC<StakeLiquidityLayoutProps> = ({
  header,
  breadcrumbs,
  stakeLiquidity,
  footer,
}) => {
  return (
    <div css={wrapper}>
      {header}
      <main className="content-wrap">
        <div className="title-container">
          <h3 className="title">Earn</h3>
          <div className="breadcrumbs">{breadcrumbs}</div>
        </div>
        <div className="stake-liquidity-section">{stakeLiquidity}</div>
      </main>
      {footer}
    </div>
  );
};

export default StakeLiquidityLayout;
