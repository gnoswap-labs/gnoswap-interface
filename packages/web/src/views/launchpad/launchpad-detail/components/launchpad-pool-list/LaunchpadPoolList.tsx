import React from "react";

import { LaunchpadPoolListWrapper } from "./LaunchpadPoolList.styles";
import LaunchpadPoolListCard from "./launchpad-pool-list-card/LaunchpadPoolListCard";
import { LaunchpadPoolModel } from "@models/launchpad";

interface LaunchpadPoolListProps {
  pools: LaunchpadPoolModel[];

  selectProjectPool: (poolId: number) => void;
}

const LaunchpadPoolList: React.FC<LaunchpadPoolListProps> = ({
  pools,
  selectProjectPool,
}) => {
  return (
    <LaunchpadPoolListWrapper>
      {pools.length > 0 &&
        pools.map((pool, idx) => (
          <LaunchpadPoolListCard
            key={pool.id}
            idx={idx + 1}
            data={pool}
            selectProjectPool={selectProjectPool}
          />
        ))}
    </LaunchpadPoolListWrapper>
  );
};

export default LaunchpadPoolList;
