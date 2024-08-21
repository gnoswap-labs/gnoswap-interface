import React from "react";
import { useTranslation } from "react-i18next";

import { wrapper } from "./PoolAddLayout.styles";

interface PoolAddLayoutProps {
  header: React.ReactNode;
  breadcrumbs: React.ReactNode;
  addLiquidity: React.ReactNode;
  quickPoolInfo: React.ReactNode;
  exchangeRateGraph: React.ReactNode;
  footer: React.ReactNode;
}

const PoolAddLayout: React.FC<PoolAddLayoutProps> = ({
  header,
  breadcrumbs,
  addLiquidity,
  quickPoolInfo,
  footer,
  exchangeRateGraph,
}) => {
  const { t } = useTranslation();

  return (
    <div css={wrapper}>
      {header}
      <main className="content-wrap">
        <div className="title-container">
          <h3 className="title">{t("business:pageHeader.earn")}</h3>
          <div className="breadcrumbs">{breadcrumbs}</div>
        </div>
        <div
          className={`wrapper-sub-content ${
            !quickPoolInfo && !exchangeRateGraph && "full-width"
          }`}
        >
          <div className="add-liquidity-section">{addLiquidity}</div>
          <div className="additional-info-section">
            <div
              className={`quick-pool-info-section ${
                quickPoolInfo && exchangeRateGraph ? "margin-bottom" : ""
              }`}
            >
              {quickPoolInfo ? quickPoolInfo : <div className="fake-div"></div>}
            </div>
            <div className="exchange-rate-graph">{exchangeRateGraph}</div>
          </div>
        </div>
      </main>
      {footer}
    </div>
  );
};

export default PoolAddLayout;
