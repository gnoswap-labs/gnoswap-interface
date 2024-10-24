import React from "react";

import { LaunchpadPoolModel } from "@models/launchpad";
import { ProjectRewardInfoModel } from "../../LaunchpadDetail";

import LaunchpadPoolList from "../../components/launchpad-pool-list/LaunchpadPoolList";

interface LaunchpadPoolListContainerProps {
  pools: LaunchpadPoolModel[];
  status: string;
  rewardInfo: ProjectRewardInfoModel;
  isLoading: boolean;

  selectProjectPool: (poolId: number) => void;
}

const LaunchpadPoolListContainer: React.FC<LaunchpadPoolListContainerProps> = ({
  pools,
  status,
  rewardInfo,
  isLoading,
  selectProjectPool,
}) => {
  return (
    <LaunchpadPoolList
      pools={pools}
      status={status}
      rewardInfo={rewardInfo}
      isLoading={isLoading}
      selectProjectPool={selectProjectPool}
    />
  );
};

export default LaunchpadPoolListContainer;
