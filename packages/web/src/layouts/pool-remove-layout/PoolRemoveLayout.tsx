import React from "react";
import { wrapper } from "./PoolRemoveLayout.styles";

interface PoolRemoveLayoutProps {
  header: React.ReactNode;
  breadcrumbs: React.ReactNode;
  removeLiquidity: React.ReactNode;
  footer: React.ReactNode;
}

const PoolRemoveLayout: React.FC<PoolRemoveLayoutProps> = ({
  header,
  breadcrumbs,
  removeLiquidity,
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
        <div className="remove-liquidity-section">{removeLiquidity}</div>
      </main>
      {footer}
    </div>
  );
};

export default PoolRemoveLayout;
