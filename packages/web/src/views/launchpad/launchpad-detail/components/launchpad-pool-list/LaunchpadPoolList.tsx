import React from "react";

import { LaunchpadPoolListWrapper } from "./LaunchpadPoolList.styles";
import LaunchpadPoolListCard from "./launchpad-pool-list-card/LaunchpadPoolListCard";
import { LaunchpadPoolModel } from "@models/launchpad";

interface LaunchpadPoolListProps {
  pools: LaunchpadPoolModel[];
}

const LaunchpadPoolList: React.FC<LaunchpadPoolListProps> = ({ pools }) => {
  return (
    <LaunchpadPoolListWrapper>
      {pools.length > 0 &&
        pools.map((pool, idx) => (
          <LaunchpadPoolListCard key={pool.id} idx={idx + 1} data={pool} />
        ))}
    </LaunchpadPoolListWrapper>
  );
};

export default LaunchpadPoolList;
