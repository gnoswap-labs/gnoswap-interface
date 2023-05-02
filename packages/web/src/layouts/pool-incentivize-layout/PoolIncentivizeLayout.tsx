import React from "react";
import { wrapper } from "./PoolIncentivizeLayout.styles";

interface PoolIncentivizeLayoutProps {
  header: React.ReactNode;
  breadcrumbs: React.ReactNode;
  poolIncentivize: React.ReactNode;
  footer: React.ReactNode;
}

const PoolIncentivizeLayout: React.FC<PoolIncentivizeLayoutProps> = ({
  header,
  breadcrumbs,
  poolIncentivize,
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
        <div className="pool-incentivize-section">{poolIncentivize}</div>
      </main>
      {footer}
    </div>
  );
};

export default PoolIncentivizeLayout;
