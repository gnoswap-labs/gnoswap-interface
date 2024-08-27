import Link from "next/link";
import React from "react";

import IconStrokeArrowRight from "@components/common/icons/IconStrokeArrowRight";

import { GovernanceLayoutWrapper, LinkButton } from "./GovernanceLayout.styles";
import { useTranslation } from "react-i18next";

interface GovernanceLayoutProps {
  header: React.ReactNode;
  summary: React.ReactNode;
  footer: React.ReactNode;
  list: React.ReactNode;
}

const GovernanceLayout: React.FC<GovernanceLayoutProps> = ({
  header,
  summary,
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
          <LinkButton>
            <div>Stake GNS/GNOT Positions to earn xGNOS</div>
            <Link href="/earn/pool/1">
              Click here <IconStrokeArrowRight className="link-icon" />
            </Link>
          </LinkButton>
        </div>
      </section>
      <div className="list-wrapper">
        <div className="list-container">{list}</div>
      </div>
      {footer}
    </GovernanceLayoutWrapper>
  );
};

export default GovernanceLayout;
