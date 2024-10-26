import React from "react";
import { useAtom } from "jotai";

import { LaunchpadState } from "@states/index";
import { ProjectRewardInfoModel } from "../../LaunchpadDetail";
import { LaunchpadPoolModel } from "@models/launchpad";
import { getTierNumber } from "@utils/launchpad-get-tier-number";

import { LaunchpadPoolListWrapper } from "./LaunchpadPoolList.styles";
import LaunchpadPoolListCard from "./launchpad-pool-list-card/LaunchpadPoolListCard";
import { LaunchpadPoolListSkeletonCard } from "./launchpad-pool-list-card/LaunchpadPoolListSkeletonCard";

interface LaunchpadPoolListProps {
  pools: LaunchpadPoolModel[];
  status: string;
  rewardInfo: ProjectRewardInfoModel;
  isLoading: boolean;

  selectProjectPool: (poolId: number) => void;
}

const LaunchpadPoolList: React.FC<LaunchpadPoolListProps> = ({
  pools,
  status,
  rewardInfo,
  isLoading,
  selectProjectPool,
}) => {
  const [, setSelectLaunchpadPool] = useAtom(
    LaunchpadState.selectLaunchpadPool,
  );

  const sortedPools = React.useMemo(() => {
    return [...pools].sort(
      (a, b) => getTierNumber(b.poolTier) - getTierNumber(a.poolTier),
    );
  }, [pools]);

  const defaultSelectPool = React.useCallback(() => {
    if (sortedPools) {
      if (sortedPools.length > 0) {
        setSelectLaunchpadPool(sortedPools[0]?.id);
      }
    }
  }, [sortedPools, sortedPools.length, setSelectLaunchpadPool]);

  React.useEffect(() => {
    if (sortedPools && status === "ONGOING") {
      defaultSelectPool();
    }
  }, [sortedPools, sortedPools.length, status, defaultSelectPool]);

  return (
    <LaunchpadPoolListWrapper>
      {isLoading &&
        Array.from({ length: 3 }).map((_, idx) => {
          return <LaunchpadPoolListSkeletonCard key={idx} idx={idx} />;
        })}
      {!isLoading &&
        sortedPools.length > 0 &&
        sortedPools.map((pool, idx) => (
          <LaunchpadPoolListCard
            key={pool.id}
            idx={idx + 1}
            rewardInfo={rewardInfo}
            data={pool}
            selectProjectPool={selectProjectPool}
          />
        ))}
    </LaunchpadPoolListWrapper>
  );
};

export default LaunchpadPoolList;
