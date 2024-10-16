import React from "react";

import LaunchpadAboutProject from "../../components/launchpad-about-project/LaunchpadAboutProject";
import { useLoading } from "@hooks/common/use-loading";
import { ProjectDescriptionDataModel } from "../../LaunchpadDetail";

interface LaunchpadAboutProjectContainerProps {
  data: ProjectDescriptionDataModel;
}

const LaunchpadAboutProjectContainer: React.FC<
  LaunchpadAboutProjectContainerProps
> = ({ data }) => {
  const { isLoading: isLoadingCommon } = useLoading();

  return <LaunchpadAboutProject loading={isLoadingCommon} data={data} />;
};

export default LaunchpadAboutProjectContainer;
