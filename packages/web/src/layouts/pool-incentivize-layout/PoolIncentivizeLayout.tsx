import React from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

  return (
    <div css={wrapper}>
      {header}
      <main className="content-wrap">
        <div className="title-container">
          <h3 className="title">{t("business:pageHeader.earn")}</h3>
          <div className="breadcrumbs">{breadcrumbs}</div>
        </div>
        <div className="pool-incentivize-section">{poolIncentivize}</div>
      </main>
      {footer}
    </div>
  );
};

export default PoolIncentivizeLayout;
