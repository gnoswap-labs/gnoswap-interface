import React from "react";
import { useTranslation } from "react-i18next";

import { PoolAddLayoutWrapper } from "./PoolAddLayout.styles";

interface PoolAddLayoutProps {
  header: React.ReactNode;
  breadcrumbs: React.ReactNode;
  addLiquidity: React.ReactNode;
  additionalInfo: React.ReactNode;
  footer: React.ReactNode;
}

const PoolAddLayout: React.FC<PoolAddLayoutProps> = ({
  header,
  breadcrumbs,
  addLiquidity,
  additionalInfo,
  footer,
}) => {
  const { t } = useTranslation();

  return (
    <PoolAddLayoutWrapper>
      {header}
      <main className="content-wrap">
        <div className="title-container">
          <h3 className="title">{t("business:pageHeader.earn")}</h3>
          <div className="breadcrumbs">{breadcrumbs}</div>
        </div>
        <div
          className={`wrapper-sub-content ${!additionalInfo && "full-width"}`}
        >
          <div className="add-liquidity-section">{addLiquidity}</div>
          {additionalInfo}
        </div>
      </main>
      {footer}
    </PoolAddLayoutWrapper>
  );
};

export default PoolAddLayout;
