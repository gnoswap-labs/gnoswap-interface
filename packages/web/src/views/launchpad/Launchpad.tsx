import React from "react";

import Footer from "@components/common/footer/Footer";
import HeaderContainer from "@containers/header-container/HeaderContainer";

import LaunchpadLayout from "./LaunchpadLayout";

const Launchpad: React.FC = () => {
  return (
    <LaunchpadLayout 
      header={<HeaderContainer />} 
      footer={<Footer />}
    />
  );
};

export default Launchpad;