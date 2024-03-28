import React from "react";
import { wrapper } from "./IncreaseLiquidityLayout.styles";

interface PoolAddLayoutProps {
  header: React.ReactNode;
  breadcrumbs: React.ReactNode;
  increaseLiquidity: React.ReactNode;
  footer: React.ReactNode;
}

const IncreaseLiquidityLayout: React.FC<PoolAddLayoutProps> = ({
  header,
  breadcrumbs,
  increaseLiquidity,
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
        <div className="wrapper-sub-content">
          <div className="increase-liquidity-section">{increaseLiquidity}</div>
        </div>
      </main>
      {footer}
    </div>
  );
};

export default IncreaseLiquidityLayout;
