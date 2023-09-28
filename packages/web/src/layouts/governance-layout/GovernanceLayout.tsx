import IconFile from "@components/common/icons/IconFile";
import React from "react";
import { GovernanceLayoutWrapper, LinkButton } from "./GovernanceLayout.styles";
import Link from "next/link";
import IconStrokeArrowRight from "@components/common/icons/IconStrokeArrowRight";

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
}) => (
  <GovernanceLayoutWrapper>
    {header}
    <section className="governance-section">
      <div className="title-container">
        <h3 className="title">Governance</h3>
        <div className="sub-title">
          <p>Learn More</p>
          <IconFile />
        </div>
      </div>
      <div className="summary-container">
        {summary}
        <LinkButton>
          <span>Stake GNOS/GNOT Positions to earn xGNOS</span>
          <Link href="/">
            Click here <IconStrokeArrowRight className="link-icon" />
          </Link>
        </LinkButton>
        {list}
      </div>
    </section>
    {footer}
  </GovernanceLayoutWrapper>
);

export default GovernanceLayout;
