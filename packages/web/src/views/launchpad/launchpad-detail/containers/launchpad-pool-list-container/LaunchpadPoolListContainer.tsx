import React from "react";

import LaunchpadPoolList from "../../components/launchpad-pool-list/LaunchpadPoolList";
import { LaunchpadPoolModel } from "@models/launchpad";

interface LaunchpadPoolListContainerProps {
  pools: LaunchpadPoolModel[];
  status: string;

  selectProjectPool: (poolId: number) => void;
}

const LaunchpadPoolListContainer: React.FC<LaunchpadPoolListContainerProps> = ({
  pools,
  status,
  selectProjectPool,
}) => {
  return (
    <LaunchpadPoolList
      pools={pools}
      status={status}
      selectProjectPool={selectProjectPool}
    />
  );
};

export default LaunchpadPoolListContainer;
