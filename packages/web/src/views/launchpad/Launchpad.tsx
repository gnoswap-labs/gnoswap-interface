import React from "react";
import { useAtomValue } from "jotai";

import HeaderContainer from "@containers/header-container/HeaderContainer";
import Footer from "@components/common/footer/Footer";
import { ThemeState } from "@states/index";

import LaunchpadLayout from "./LaunchpadLayout";
import LaunchpadActiveProjectContainer from "./containers/launchpad-active-project-container/LaunchpadActiveProjectContainer";
import IconLaunchpadMain from "@components/common/icons/IconLaunchpadMain";
import LaunchpadMainContainer from "./containers/launchpad-main-container/LaunchpadMainContainer";
import LaunchpadProjectListContainer from "./containers/launchpad-project-list-container/LaunchpadProjectListContainer";

const Launchpad: React.FC = () => {
  const themeKey = useAtomValue(ThemeState.themeKey);

  return (
    <LaunchpadLayout
      header={<HeaderContainer />}
      main={
        <LaunchpadMainContainer
          icon={
            <IconLaunchpadMain themeKey={themeKey} className="icon-launchpad" />
          }
        />
      }
      activeProjects={<LaunchpadActiveProjectContainer />}
      projectList={<LaunchpadProjectListContainer />}
      footer={<Footer />}
    />
  );
};

export default Launchpad;
