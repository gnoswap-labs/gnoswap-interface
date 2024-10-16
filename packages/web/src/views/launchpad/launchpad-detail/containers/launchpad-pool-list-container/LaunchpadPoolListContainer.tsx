import React from "react";

import LaunchpadPoolList from "../../components/launchpad-pool-list/LaunchpadPoolList";
import { LaunchpadPoolModel } from "@models/launchpad";

interface LaunchpadPoolListContainerProps {
  pools: LaunchpadPoolModel[];

  selectProjectPool: (poolId: number) => void;
}

const LaunchpadPoolListContainer: React.FC<LaunchpadPoolListContainerProps> = ({
  pools,
  selectProjectPool,
}) => {
  return (
    <LaunchpadPoolList pools={pools} selectProjectPool={selectProjectPool} />
  );
};

export default LaunchpadPoolListContainer;
