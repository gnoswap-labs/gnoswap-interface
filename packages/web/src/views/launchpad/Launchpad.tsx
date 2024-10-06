import React from "react";
import { useAtomValue } from "jotai";

import HeaderContainer from "@containers/header-container/HeaderContainer";
import Footer from "@components/common/footer/Footer";

import LaunchpadLayout from "./LaunchpadLayout";
import LaunchpadActiveProjectContainer from "./containers/launchpad-active-project-container/LaunchpadActiveProjectContainer";
import IconLaunchpadMain from "@components/common/icons/IconLaunchpadMain";
import { ThemeState } from "@states/index";

const Launchpad: React.FC = () => {
  const themeKey = useAtomValue(ThemeState.themeKey);

  return (
    <LaunchpadLayout
      header={<HeaderContainer />}
      projects={<LaunchpadActiveProjectContainer />}
      icon={
        <IconLaunchpadMain themeKey={themeKey} className="icon-launchpad" />
      }
      footer={<Footer />}
    />
  );
};

export default Launchpad;
