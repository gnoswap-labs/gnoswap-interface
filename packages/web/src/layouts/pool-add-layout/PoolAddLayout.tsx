import React from "react";
import { wrapper } from "./PoolAddLayout.styles";

interface PoolAddLayoutProps {
  header: React.ReactNode;
  breadcrumbs: React.ReactNode;
  addLiquidity: React.ReactNode;
  oneStaking: React.ReactNode;
  exchangeRateGraph: React.ReactNode;
  footer: React.ReactNode;
}

const PoolAddLayout: React.FC<PoolAddLayoutProps> = ({
  header,
  breadcrumbs,
  addLiquidity,
  oneStaking,
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
        <div className={`wrapper-sub-content ${!oneStaking && "full-width"}`}>
          <div className="add-liquidity-section">{addLiquidity}</div>
          <div className="one-click-staking">{oneStaking ? oneStaking : <div className="fake-div"></div>}</div>
        </div>
      </main>
      {footer}
    </div>
  );
};

export default PoolAddLayout;
