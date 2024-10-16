import React from "react";

import LaunchpadProjectSummary from "../../components/launchpad-project-summary/LaunchpadProjectSummary";
import { ProjectSummaryDataModel } from "../../LaunchpadDetail";

interface LaunchpadProjectSummaryContainerProps {
  data: ProjectSummaryDataModel;
}

const LaunchpadProjectSummaryContainer: React.FC<
  LaunchpadProjectSummaryContainerProps
> = ({ data }) => {
  return <LaunchpadProjectSummary data={data} />;
};

export default LaunchpadProjectSummaryContainer;
