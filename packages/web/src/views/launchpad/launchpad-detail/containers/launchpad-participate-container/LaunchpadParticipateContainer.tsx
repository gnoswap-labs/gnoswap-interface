import { LaunchpadPoolModel } from "@models/launchpad";
import React from "react";

import LaunchpadParticipate from "../../components/launchpad-participate/LaunchpadParticipate";

interface LaunchpadParticipateContainerProps {
  poolInfo?: LaunchpadPoolModel;
}

const LaunchpadParticipateContainer: React.FC<
  LaunchpadParticipateContainerProps
> = ({ poolInfo }) => {
  return <LaunchpadParticipate poolInfo={poolInfo} />;
};

export default LaunchpadParticipateContainer;
