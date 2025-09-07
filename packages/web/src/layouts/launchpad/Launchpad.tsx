import React from "react";

import HeaderContainer from "@containers/header-container/HeaderContainer";
import Footer from "@components/common/footer/Footer";

import LaunchpadLayout from "./LaunchpadLayout";
import LaunchpadActiveProjectContainer from "./containers/launchpad-active-project-container/LaunchpadActiveProjectContainer";
import LaunchpadMainContainer from "./containers/launchpad-main-container/LaunchpadMainContainer";
import LaunchpadProjectListContainer from "./containers/launchpad-project-list-container/LaunchpadProjectListContainer";

const Launchpad: React.FC = () => {
  return (
    <LaunchpadLayout
      header={<HeaderContainer />}
      main={<LaunchpadMainContainer />}
      activeProjects={<LaunchpadActiveProjectContainer />}
      projectList={<LaunchpadProjectListContainer />}
      footer={<Footer />}
    />
  );
};

export default Launchpad;
