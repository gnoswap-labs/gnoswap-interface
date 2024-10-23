import { LaunchpadPoolModel } from "@models/launchpad";
import React from "react";

import LaunchpadParticipate from "../../components/launchpad-participate/LaunchpadParticipate";
import { ProjectRewardInfoModel } from "../../LaunchpadDetail";

interface LaunchpadParticipateContainerProps {
  poolInfo?: LaunchpadPoolModel;
  rewardInfo: ProjectRewardInfoModel;
  status: string;
  selectPoolId: number | null;

  refetch: () => Promise<void>;
}

const LaunchpadParticipateContainer: React.FC<
  LaunchpadParticipateContainerProps
> = ({ poolInfo, rewardInfo, status, selectPoolId, refetch }) => {
  return (
    <LaunchpadParticipate
      poolInfo={poolInfo}
      rewardInfo={rewardInfo}
      status={status}
      selectPoolId={selectPoolId}
      refetch={refetch}
    />
  );
};

export default LaunchpadParticipateContainer;
