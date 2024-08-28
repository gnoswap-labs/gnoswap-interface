import React from "react";

import { useTranslation } from "react-i18next";
import { GovernanceLayoutWrapper } from "./GovernanceLayout.styles";

interface GovernanceLayoutProps {
  header: React.ReactNode;
  summary: React.ReactNode;
  myDelegation: React.ReactNode;
  footer: React.ReactNode;
  list: React.ReactNode;
}

const GovernanceLayout: React.FC<GovernanceLayoutProps> = ({
  header,
  summary,
  myDelegation,
  list,
  footer,
}) => {
  const {t} = useTranslation();

  return (
    <GovernanceLayoutWrapper>
      {header}
      <section className="governance-section">
        <div className="title-container">
          <h3 className="title">{t("Governance:header")}</h3>
        </div>
        <div className="summary-container">
          {summary}
          {myDelegation}
        </div>
      </section>
      <div className="proposal-list-wrapper">
        <div className="background"/>
        <div className="proposal-list-container">{list}</div>
      </div>
      {footer}
    </GovernanceLayoutWrapper>
  );
};

export default GovernanceLayout;
