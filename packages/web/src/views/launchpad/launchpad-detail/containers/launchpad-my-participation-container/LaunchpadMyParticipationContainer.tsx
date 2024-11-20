import React from "react";

import { LaunchpadParticipationModel, LaunchpadPoolModel } from "@models/launchpad";
import { ProjectRewardInfoModel } from "../../LaunchpadDetail";
import { useWallet } from "@hooks/wallet/use-wallet";
import { useLaunchpadHandler } from "@hooks/launchpad/use-launchpad-handler";

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
  const { claimAll } = useLaunchpadHandler();

  return (
    <LaunchpadMyParticipation
      poolInfos={poolInfos}
      data={data}
      rewardInfo={rewardInfo}
      isWalletConnected={connected}
      isFetched={isFetched}
      isLoading={isLoading}
      status={status}
      refetch={refetch}
      isSwitchNetwork={isSwitchNetwork}
      claimAll={(...params) => claimAll(...params, refetch)}
    />
  );
};

export default LaunchpadMyParticipationContainer;
