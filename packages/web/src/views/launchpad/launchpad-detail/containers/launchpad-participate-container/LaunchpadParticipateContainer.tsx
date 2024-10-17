import { LaunchpadPoolModel } from "@models/launchpad";
import React from "react";

import LaunchpadParticipate from "../../components/launchpad-participate/LaunchpadParticipate";
import { ProjectRewardInfoModel } from "../../LaunchpadDetail";

interface LaunchpadParticipateContainerProps {
  poolInfo?: LaunchpadPoolModel;
  rewardInfo: ProjectRewardInfoModel;
  status: string;

  refetch: () => Promise<void>;
}

const LaunchpadParticipateContainer: React.FC<
  LaunchpadParticipateContainerProps
> = ({ poolInfo, rewardInfo, status, refetch }) => {
  return (
    <LaunchpadParticipate
      poolInfo={poolInfo}
      rewardInfo={rewardInfo}
      status={status}
      refetch={refetch}
    />
  );
};

export default LaunchpadParticipateContainer;
