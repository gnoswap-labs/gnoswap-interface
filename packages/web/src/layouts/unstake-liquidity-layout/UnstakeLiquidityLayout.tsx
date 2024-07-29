import React from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

  return (
    <div css={wrapper}>
      {header}
      <main className="content-wrap">
        <div className="title-container">
          <h3 className="title">{t("business:pageHeader.earn")}</h3>
          <div className="breadcrumbs">{breadcrumbs}</div>
        </div>
        <div className="unstake-liquidity-section">{unstakeLiquidity}</div>
      </main>
      {footer}
    </div>
  );
};

export default UnstakeLiquidityLayout;
