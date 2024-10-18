import React from "react";

import LaunchpadProjectSummary from "../../components/launchpad-project-summary/LaunchpadProjectSummary";
import { ProjectSummaryDataModel } from "../../LaunchpadDetail";

interface LaunchpadProjectSummaryContainerProps {
  data: ProjectSummaryDataModel;
  tokenSymbol: string;
}

const LaunchpadProjectSummaryContainer: React.FC<
  LaunchpadProjectSummaryContainerProps
> = ({ data, tokenSymbol }) => {
  return <LaunchpadProjectSummary data={data} tokenSymbol={tokenSymbol} />;
};

export default LaunchpadProjectSummaryContainer;
