import React from "react";

import LaunchpadAboutProject from "../../components/launchpad-about-project/LaunchpadAboutProject";
import { useLoading } from "@hooks/common/use-loading";

const LaunchpadAboutProjectContainer: React.FC = () => {
  const { isLoading: isLoadingCommon } = useLoading();

  return <LaunchpadAboutProject loading={isLoadingCommon} />;
};

export default LaunchpadAboutProjectContainer;
