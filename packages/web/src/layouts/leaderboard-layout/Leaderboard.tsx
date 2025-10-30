import React from "react";

import { useVideoGuide } from "@hooks/common/use-video-guide";
import { VIDEO_GUIDE_TYPES } from "@constants/video-guide.constant";
import { isValidVideoGuideType } from "@utils/video-guide.utils";

import Footer from "@components/common/footer/Footer";
import HeaderContainer from "@containers/header-container/HeaderContainer";

import LeaderboardSubHeaderContainer from "./containers/leaderboard-subheader-container/LeaderboardSubheaderContainer";
import LeaderboardBannerContainer from "./containers/leaderboard-banner-container/LeaderboardBannerContainer";
import LeaderboardList from "./leaderboard-list/LeaderboardList";
import LeaderboardLayout from "./LeaderboardLayout";
import VideoGuideModal from "@components/common/video-guide-modal/VideoGuideModal";

const Leaderboard: React.FC = () => {
  const {
    currentGuide,
    isOpen: isOpenVideoGuide,
    openVideoGuide,
    closeVideoGuide,
  } = useVideoGuide(VIDEO_GUIDE_TYPES.LEADERBOARD);
  return (
    <>
      <LeaderboardLayout
        header={<HeaderContainer />}
        subheader={<LeaderboardSubHeaderContainer onOpenVideoGuide={openVideoGuide} />}
        banner={<LeaderboardBannerContainer />}
        list={<LeaderboardList />}
        footer={<Footer />}
      />
      {isOpenVideoGuide && isValidVideoGuideType(currentGuide) && (
        <VideoGuideModal videoType={currentGuide} setIsOpen={closeVideoGuide} />
      )}
    </>
  );
};

export default Leaderboard;
