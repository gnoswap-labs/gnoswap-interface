import React from "react";

import useCustomRouter from "@hooks/common/use-custom-router";
import { useLaunchpadHandler } from "@hooks/launchpad/data/use-launchpad-handler";
import { LaunchpadPoolModel } from "@models/launchpad";
import { ProjectRewardInfoModel } from "../../LaunchpadDetail";

import LaunchpadParticipate from "../../components/launchpad-participate/LaunchpadParticipate";

interface LaunchpadParticipateContainerProps {
  connected: boolean;
  poolInfo?: LaunchpadPoolModel;
  rewardInfo: ProjectRewardInfoModel;
  status: string;
  isLoading: boolean;

  refetch: () => Promise<void>;
}

const LaunchpadParticipateContainer: React.FC<LaunchpadParticipateContainerProps> = ({
  connected,
  poolInfo,
  rewardInfo,
  status,
  isLoading,
  refetch,
}) => {
  const router = useCustomRouter();
  const projectPath = router.getProjectPath();

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
