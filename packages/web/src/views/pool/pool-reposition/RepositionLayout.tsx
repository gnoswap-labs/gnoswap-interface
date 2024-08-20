import React from "react";
import { useTranslation } from "react-i18next";

import { wrapper } from "./RepositionLayout.styles";

interface PoolAddLayoutProps {
  header: React.ReactNode;
  breadcrumbs: React.ReactNode;
  reposition: React.ReactNode;
  footer: React.ReactNode;
}

const RepositionLayout: React.FC<PoolAddLayoutProps> = ({
  header,
  breadcrumbs,
  reposition,
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
          <div className="reposition-section">{reposition}</div>
        </div>
      </main>
      {footer}
    </div>
  );
};

export default RepositionLayout;
