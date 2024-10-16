import { LaunchpadPoolModel } from "@models/launchpad";
import React from "react";

import LaunchpadParticipate from "../../components/launchpad-participate/LaunchpadParticipate";

interface LaunchpadParticipateContainerProps {
  poolInfo?: LaunchpadPoolModel;
  refetch: () => Promise<void>;
}

const LaunchpadParticipateContainer: React.FC<
  LaunchpadParticipateContainerProps
> = ({ poolInfo, refetch }) => {
  return <LaunchpadParticipate poolInfo={poolInfo} refetch={refetch} />;
};

export default LaunchpadParticipateContainer;
