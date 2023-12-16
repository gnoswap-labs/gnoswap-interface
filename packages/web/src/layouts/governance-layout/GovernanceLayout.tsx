import IconFile from "@components/common/icons/IconFile";
import React, { useState } from "react";
import { GovernanceLayoutWrapper, LinkButton } from "./GovernanceLayout.styles";
import Link from "next/link";
import IconStrokeArrowRight from "@components/common/icons/IconStrokeArrowRight";
import LearnMoreModal from "@components/governance/learn-more-modal/LearnMoreModal";

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
  const [isShowLearnMoreModal, setIsShowLearnMoreModal] = useState(false);
  return (
    <GovernanceLayoutWrapper>
      {header}
      <section className="governance-section">
        <div className="title-container">
          <h3 className="title">Governance</h3>
          <div
            className="sub-title-layout"
            onClick={() => setIsShowLearnMoreModal(true)}
          >
            <p>Learn More</p>
            <IconFile />
          </div>
        </div>
        <div className="summary-container">
          {summary}
          <LinkButton>
            <span>Stake GNS/GNOT Positions to earn xGNOS</span>
            <Link href="/earn/pool/1">
              Click here <IconStrokeArrowRight className="link-icon" />
            </Link>
          </LinkButton>
        </div>
      </section>
      <div className="list-wrapper">
        <div className="summary-container">{list}</div>
      </div>
      {footer}
      {isShowLearnMoreModal && (
        <LearnMoreModal setIsShowLearnMoreModal={setIsShowLearnMoreModal} />
      )}
    </GovernanceLayoutWrapper>
  );
};

export default GovernanceLayout;
