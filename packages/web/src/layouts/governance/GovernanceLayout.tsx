import React from "react";
import { useTranslation } from "react-i18next";

import { getCanScrollUpId } from "@constants/common.constant";

import { useWindowSize } from "@hooks/common/use-window-size";
import { VIDEO_GUIDE_TYPES } from "@constants/video-guide.constant";

import { GovernanceLayoutWrapper } from "./GovernanceLayout.styles";
import VideoGuideTrigger from "@components/common/video-guide-trigger/VideoGuideTrigger";

interface GovernanceLayoutProps {
  header: React.ReactNode;
  summary: React.ReactNode;
  myDelegation: React.ReactNode;
  footer: React.ReactNode;
  list: React.ReactNode;
  onOpenVideoGuide: (type: "GOVERNANCE") => void;
}

const GovernanceLayout: React.FC<GovernanceLayoutProps> = ({
  header,
  summary,
  myDelegation,
  list,
  footer,
  onOpenVideoGuide,
}) => {
  const { t } = useTranslation();
  const { isMobile } = useWindowSize();

  const handleOpenVideoGuide = React.useCallback(() => {
    onOpenVideoGuide(VIDEO_GUIDE_TYPES.GOVERNANCE);
  }, [onOpenVideoGuide]);

  return (
    <GovernanceLayoutWrapper>
      {header}
      <section className="governance-section">
        <div className="title-container">
          <h3 className="title">{t("Governance:header")}</h3>
          {isMobile && <VideoGuideTrigger text={`${t("common:guide.learnMore")} ▶`} onClick={handleOpenVideoGuide} />}
        </div>
        <div className="summary-container">
          {summary}
          {myDelegation}
        </div>
      </section>
      <div className="proposal-list-wrapper" id={getCanScrollUpId("proposal-list")}>
        <div className="background" id="proposal-list" />
        <div className="proposal-list-container">{list}</div>
      </div>
      {footer}
    </GovernanceLayoutWrapper>
  );
};

export default GovernanceLayout;
