import React from "react";

import { useVideoGuide } from "@hooks/common/use-video-guide";
import { VIDEO_GUIDE_TYPES } from "@constants/video-guide.constant";
import { isValidVideoGuideType } from "@utils/video-guide.utils";

import HeaderContainer from "@containers/header-container/HeaderContainer";
import Footer from "@components/common/footer/Footer";

import LaunchpadLayout from "./LaunchpadLayout";
import LaunchpadActiveProjectContainer from "./containers/launchpad-active-project-container/LaunchpadActiveProjectContainer";
import LaunchpadMainContainer from "./containers/launchpad-main-container/LaunchpadMainContainer";
import LaunchpadProjectListContainer from "./containers/launchpad-project-list-container/LaunchpadProjectListContainer";
import VideoGuideModal from "@components/common/video-guide-modal/VideoGuideModal";

const Launchpad: React.FC = () => {
  const {
    currentGuide,
    isOpen: isOpenVideoGuide,
    openVideoGuide,
    closeVideoGuide,
  } = useVideoGuide(VIDEO_GUIDE_TYPES.LAUNCHPAD);
  return (
    <>
      <LaunchpadLayout
        header={<HeaderContainer />}
        main={<LaunchpadMainContainer onOpenVideoGuide={openVideoGuide} />}
        activeProjects={<LaunchpadActiveProjectContainer />}
        projectList={<LaunchpadProjectListContainer />}
        footer={<Footer />}
      />
      {isOpenVideoGuide && isValidVideoGuideType(currentGuide) && (
        <VideoGuideModal videoType={currentGuide} setIsOpen={closeVideoGuide} />
      )}
    </>
  );
};

export default Launchpad;
