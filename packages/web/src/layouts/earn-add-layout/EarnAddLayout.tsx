import React from "react";
import { useTranslation } from "react-i18next";
import { wrapper } from "./EarnAddLayout.styles";

interface EarnAddLayoutProps {
  header: React.ReactNode;
  breadcrumbs: React.ReactNode;
  addLiquidity: React.ReactNode;
  quickPoolInfo: React.ReactNode;
  exchangeRateGraph: React.ReactNode;
  footer: React.ReactNode;
}

const EarnAddLayout: React.FC<EarnAddLayoutProps> = ({
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
            !quickPoolInfo && "full-width"
          }`}
        >
          <div className="add-liquidity-section">{addLiquidity}</div>
          <div className="additional-info-section">
            <div
              className={`quick-pool-info-section ${
                quickPoolInfo && exchangeRateGraph ? "margin-bottom" : ""
              }`}
            >
              {quickPoolInfo ? quickPoolInfo : null}
            </div>
            <div className="exchange-rate-graph">{exchangeRateGraph}</div>
          </div>
        </div>
      </main>
      {footer}
    </div>
  );
};

export default EarnAddLayout;
