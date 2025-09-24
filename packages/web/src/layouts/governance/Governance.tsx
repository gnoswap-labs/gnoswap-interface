import React from "react";

import { useVideoGuide } from "@hooks/common/use-video-guide";
import { VIDEO_GUIDE_TYPES } from "@constants/video-guide.constant";
import { isValidVideoGuideType } from "@utils/video-guide.utils";

import Footer from "@components/common/footer/Footer";
import HeaderContainer from "@containers/header-container/HeaderContainer";

import GovernanceContainer from "./containers/governance-summary-container/GovernanceSummaryContainer";
import MyDelegationContainer from "./containers/my-delegation-container/MyDelegationContainer";
import ProposalListContainer from "./containers/proposal-list-container/ProposalListContainer";
import GovernanceLayout from "./GovernanceLayout";
import VideoGuideModal from "@components/common/video-guide-modal/VideoGuideModal";

const Governance: React.FC = () => {
  const {
    currentGuide,
    isOpen: isOpenVideoGuide,
    openVideoGuide,
    closeVideoGuide,
  } = useVideoGuide(VIDEO_GUIDE_TYPES.GOVERNANCE);
  return (
    <>
      <GovernanceLayout
        header={<HeaderContainer />}
        summary={<GovernanceContainer onOpenVideoGuide={openVideoGuide} />}
        myDelegation={<MyDelegationContainer />}
        list={<ProposalListContainer />}
        footer={<Footer />}
      />
      {isOpenVideoGuide && isValidVideoGuideType(currentGuide) && (
        <VideoGuideModal videoType={currentGuide} setIsOpen={closeVideoGuide} />
      )}
    </>
  );
};

export default Governance;
