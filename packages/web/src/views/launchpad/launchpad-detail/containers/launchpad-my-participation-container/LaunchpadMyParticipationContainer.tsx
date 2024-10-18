import React from "react";

import {
  LaunchpadParticipationModel,
  LaunchpadPoolModel,
} from "@models/launchpad";

import LaunchpadMyParticipation from "../../components/launchpad-my-participation/LaunchpadMyParticipation";

interface LaunchpadMyParticipationContainerProps {
  poolInfos: LaunchpadPoolModel[];
  data: LaunchpadParticipationModel[];

  refetch: () => Promise<void>;
}

const LaunchpadMyParticipationContainer = ({
  poolInfos,
  data,
  refetch,
}: LaunchpadMyParticipationContainerProps) => {
  return (
    <LaunchpadMyParticipation
      poolInfos={poolInfos}
      data={data}
      refetch={refetch}
    />
  );
};

export default LaunchpadMyParticipationContainer;
