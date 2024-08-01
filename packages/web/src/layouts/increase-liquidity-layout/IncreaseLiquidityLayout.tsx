import React from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

  return (
    <div css={wrapper}>
      {header}
      <main className="content-wrap">
        <div className="title-container">
          <h3 className="title">{t("business:pageHeader.earn")}</h3>
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
