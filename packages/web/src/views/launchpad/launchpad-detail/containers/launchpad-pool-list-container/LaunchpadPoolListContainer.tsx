import React from "react";

import LaunchpadPoolList from "../../components/launchpad-pool-list/LaunchpadPoolList";
import { LaunchpadPoolModel } from "@models/launchpad";

interface LaunchpadPoolListContainerProps {
  pools: LaunchpadPoolModel[];
}

const LaunchpadPoolListContainer: React.FC<LaunchpadPoolListContainerProps> = ({
  pools,
}) => {
  return <LaunchpadPoolList pools={pools} />;
};

export default LaunchpadPoolListContainer;
