import React from "react";

import { rawToDisplayAmount } from "@utils/number-utils";
import { ProjectSummaryDataModel } from "../../LaunchpadDetail";
import { GNS_TOKEN } from "@common/values/token-constant";

import LaunchpadProjectSummary from "../../components/launchpad-project-summary/LaunchpadProjectSummary";

interface LaunchpadProjectSummaryContainerProps {
  data: ProjectSummaryDataModel;
  tokenSymbol: string;
  isLoading: boolean;
}

const LaunchpadProjectSummaryContainer: React.FC<LaunchpadProjectSummaryContainerProps> = ({
  data,
  tokenSymbol,
  isLoading,
}) => {
  const displaySummaryData: ProjectSummaryDataModel = React.useMemo(() => {
    const GNS_TOKEN_DECIMALS = GNS_TOKEN.decimals;

    return {
      ...data,
      totalAllocation: rawToDisplayAmount(data.totalAllocation, GNS_TOKEN_DECIMALS),
      totalDeposited: rawToDisplayAmount(data.totalDeposited, GNS_TOKEN_DECIMALS),
      totalDistributed: rawToDisplayAmount(data.totalDistributed, GNS_TOKEN_DECIMALS),
    };
  }, [data]);

  return <LaunchpadProjectSummary data={displaySummaryData} tokenSymbol={tokenSymbol} isLoading={isLoading} />;
};

export default LaunchpadProjectSummaryContainer;
