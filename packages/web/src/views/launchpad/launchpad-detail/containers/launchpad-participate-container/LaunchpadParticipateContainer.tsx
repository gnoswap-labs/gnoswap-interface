import React from "react";

import useCustomRouter from "@hooks/common/use-custom-router";
import { useLaunchpadHandler } from "@hooks/launchpad/use-launchpad-handler";
import { useWallet } from "@hooks/wallet/use-wallet";
import { LaunchpadPoolModel } from "@models/launchpad";
import { ProjectRewardInfoModel } from "../../LaunchpadDetail";

import LaunchpadParticipate from "../../components/launchpad-participate/LaunchpadParticipate";

interface LaunchpadParticipateContainerProps {
  poolInfo?: LaunchpadPoolModel;
  rewardInfo: ProjectRewardInfoModel;
  status: string;
  isLoading: boolean;

  refetch: () => Promise<void>;
}

const LaunchpadParticipateContainer: React.FC<
  LaunchpadParticipateContainerProps
> = ({ poolInfo, rewardInfo, status, isLoading, refetch }) => {
  const router = useCustomRouter();
  const projectPath = router.getProjectPath();

  const { connected } = useWallet();
  const { deposit } = useLaunchpadHandler();

  return (
    <LaunchpadParticipate
      poolInfo={poolInfo}
      rewardInfo={rewardInfo}
      status={status}
      projectPath={projectPath || ""}
      isLoading={isLoading}
      isWalletConnected={connected}
      refetch={refetch}
      depositGNS={(...params) => deposit(...params, refetch)}
    />
  );
};

export default LaunchpadParticipateContainer;
