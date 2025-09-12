import React from "react";

import { rawToDisplayAmount } from "@utils/number-utils";
import { ProjectRewardInfoModel, ProjectSummaryDataModel } from "../../LaunchpadDetail";
import { GNS_TOKEN } from "@common/values/token-constant";

import LaunchpadProjectSummary from "../../components/launchpad-project-summary/LaunchpadProjectSummary";

interface LaunchpadProjectSummaryContainerProps {
  data: ProjectSummaryDataModel;
  rewardInfo: ProjectRewardInfoModel;
  tokenSymbol: string;
  isLoading: boolean;
}

const LaunchpadProjectSummaryContainer: React.FC<LaunchpadProjectSummaryContainerProps> = ({
  data,
  rewardInfo,
  tokenSymbol,
  isLoading,
}) => {
  const displaySummaryData: ProjectSummaryDataModel = React.useMemo(() => {
    const GNS_TOKEN_DECIMALS = GNS_TOKEN.decimals;
    const REWARD_TOKEN_DECIMALS = rewardInfo.rewardTokenDecimals;

    return {
      ...data,
      totalAllocation: rawToDisplayAmount(data.totalAllocation, REWARD_TOKEN_DECIMALS),
      totalDeposited: rawToDisplayAmount(data.totalDeposited, GNS_TOKEN_DECIMALS),
      totalDistributed: rawToDisplayAmount(data.totalDistributed, REWARD_TOKEN_DECIMALS),
    };
  }, [data, rewardInfo]);

  return <LaunchpadProjectSummary data={displaySummaryData} tokenSymbol={tokenSymbol} isLoading={isLoading} />;
};

export default LaunchpadProjectSummaryContainer;
