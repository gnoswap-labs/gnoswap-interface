import React from "react";

import { LaunchpadPoolModel } from "@models/launchpad";
import { ProjectRewardInfoModel } from "../../LaunchpadDetail";
import { GNS_TOKEN } from "@common/values/token-constant";
import { rawToDisplayAmount } from "@utils/number-utils";

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
  const displayLaunchpadPoolList: LaunchpadPoolModel[] = React.useMemo(() => {
    const GNS_TOKEN_DECIMALS = GNS_TOKEN.decimals;

    return pools.map(pool => {
      return {
        ...pool,
        allocation: rawToDisplayAmount(pool.allocation, rewardInfo.rewardTokenDecimals),
        depositAmount: rawToDisplayAmount(pool.depositAmount, GNS_TOKEN_DECIMALS),
      };
    });
  }, [pools, rewardInfo]);

  return (
    <LaunchpadPoolList
      pools={displayLaunchpadPoolList}
      status={status}
      rewardInfo={rewardInfo}
      isLoading={isLoading}
      selectProjectPool={selectProjectPool}
    />
  );
};

export default LaunchpadPoolListContainer;
