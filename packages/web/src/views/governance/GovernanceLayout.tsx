import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";

import IconNote from "@components/common/icons/IconNote";
import { EXT_URL } from "@constants/external-url.contant";
import { useWindowSize } from "@hooks/common/use-window-size";

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
  const { isMobile } = useWindowSize();

  return (
    <GovernanceLayoutWrapper>
      {header}
      <section className="governance-section">
        <div className="title-container">
          <h3 className="title">{t("Governance:header")}</h3>
          {isMobile && (
            <Link
              className="learn-more"
              href={EXT_URL.DOCS.XGNS}
              target="_blank"
            >
              {t("common:learnMore")}
              <IconNote />
            </Link>
          )}
        </div>
        <div className="summary-container">
          {summary}
          {myDelegation}
        </div>
      </section>
      <div className="proposal-list-wrapper">
        <div className="background" />
        <div className="proposal-list-container">{list}</div>
      </div>
      {footer}
    </GovernanceLayoutWrapper>
  );
};

export default GovernanceLayout;
