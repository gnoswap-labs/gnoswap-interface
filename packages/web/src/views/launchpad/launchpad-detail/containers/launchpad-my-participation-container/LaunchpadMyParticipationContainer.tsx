import React from "react";

import {
  LaunchpadParticipationModel,
  LaunchpadPoolModel,
} from "@models/launchpad";
import { ProjectRewardInfoModel } from "../../LaunchpadDetail";
import { useWallet } from "@hooks/wallet/use-wallet";

import LaunchpadMyParticipation from "../../components/launchpad-my-participation/LaunchpadMyParticipation";

interface LaunchpadMyParticipationContainerProps {
  poolInfos: LaunchpadPoolModel[];
  data: LaunchpadParticipationModel[];
  status: string;
  rewardInfo: ProjectRewardInfoModel;
  isFetched: boolean;
  isLoading: boolean;

  refetch: () => Promise<void>;
}

const LaunchpadMyParticipationContainer = ({
  poolInfos,
  data,
  rewardInfo,
  isFetched,
  status,
  isLoading,
  refetch,
}: LaunchpadMyParticipationContainerProps) => {
  const { connected, isSwitchNetwork } = useWallet();

  return (
    <LaunchpadMyParticipation
      poolInfos={poolInfos}
      data={data}
      rewardInfo={rewardInfo}
      connected={connected}
      isFetched={isFetched}
      isLoading={isLoading}
      status={status}
      refetch={refetch}
      isSwitchNetwork={isSwitchNetwork}
    />
  );
};

export default LaunchpadMyParticipationContainer;
