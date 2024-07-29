import React from "react";
import { wrapper } from "./UnstakeLiquidityLayout.styles";

interface UnstakeLiquidityLayoutProps {
  header: React.ReactNode;
  breadcrumbs: React.ReactNode;
  unstakeLiquidity: React.ReactNode;
  footer: React.ReactNode;
}

const UnstakeLiquidityLayout: React.FC<UnstakeLiquidityLayoutProps> = ({
  header,
  breadcrumbs,
  unstakeLiquidity,
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
        <div className="unstake-liquidity-section">{unstakeLiquidity}</div>
      </main>
      {footer}
    </div>
  );
};

export default UnstakeLiquidityLayout;
