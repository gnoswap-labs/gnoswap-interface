import React from "react";
import { wrapper } from "./PoolAddLayout.styles";

interface PoolAddLayoutProps {
  header: React.ReactNode;
  breadcrumbs: React.ReactNode;
  addLiquidity: React.ReactNode;
  footer: React.ReactNode;
}

const PoolAddLayout: React.FC<PoolAddLayoutProps> = ({
  header,
  breadcrumbs,
  addLiquidity,
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
        <div className="add-liquidity-section">{addLiquidity}</div>
      </main>
      {footer}
    </div>
  );
};

export default PoolAddLayout;
