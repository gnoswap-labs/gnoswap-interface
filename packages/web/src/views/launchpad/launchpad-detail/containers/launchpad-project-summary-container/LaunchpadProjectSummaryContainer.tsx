import React from "react";

import LaunchpadProjectSummary from "../../components/launchpad-project-summary/LaunchpadProjectSummary";
import { ProjectSummaryDataModel } from "../../LaunchpadDetail";

interface LaunchpadProjectSummaryContainerProps {
  data: ProjectSummaryDataModel;
  tokenSymbol: string;
  isLoading: boolean;
}

const LaunchpadProjectSummaryContainer: React.FC<
  LaunchpadProjectSummaryContainerProps
> = ({ data, tokenSymbol, isLoading }) => {
  return (
    <LaunchpadProjectSummary
      data={data}
      tokenSymbol={tokenSymbol}
      isLoading={isLoading}
    />
  );
};

export default LaunchpadProjectSummaryContainer;
