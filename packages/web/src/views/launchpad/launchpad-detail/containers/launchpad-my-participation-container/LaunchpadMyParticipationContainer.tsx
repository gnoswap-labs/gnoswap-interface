import React from "react";

import {
  LaunchpadParticipationModel,
  LaunchpadPoolModel,
} from "@models/launchpad";
import { ProjectRewardInfoModel } from "../../LaunchpadDetail";

import LaunchpadMyParticipation from "../../components/launchpad-my-participation/LaunchpadMyParticipation";

interface LaunchpadMyParticipationContainerProps {
  poolInfos: LaunchpadPoolModel[];
  data: LaunchpadParticipationModel[];
  rewardInfo: ProjectRewardInfoModel;

  refetch: () => Promise<void>;
}

const LaunchpadMyParticipationContainer = ({
  poolInfos,
  data,
  rewardInfo,
  refetch,
}: LaunchpadMyParticipationContainerProps) => {
  return (
    <LaunchpadMyParticipation
      poolInfos={poolInfos}
      data={data}
      rewardInfo={rewardInfo}
      refetch={refetch}
    />
  );
};

export default LaunchpadMyParticipationContainer;
