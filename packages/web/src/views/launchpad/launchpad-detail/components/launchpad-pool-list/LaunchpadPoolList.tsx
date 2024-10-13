import React from "react";

import { LaunchpadPoolListWrapper } from "./LaunchpadPoolList.styles";
import LaunchpadPoolListCard from "./launchpad-pool-list-card/LaunchpadPoolListCard";

const LaunchpadPoolList: React.FC = () => {
  return (
    <LaunchpadPoolListWrapper>
      <LaunchpadPoolListCard />
      <LaunchpadPoolListCard />
      <LaunchpadPoolListCard />
    </LaunchpadPoolListWrapper>
  );
};

export default LaunchpadPoolList;
