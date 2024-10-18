import React from "react";

import { LaunchpadPoolModel } from "@models/launchpad";
import { ProjectRewardInfoModel } from "@views/launchpad/launchpad-detail/LaunchpadDetail";

import LaunchpadDepositModal from "@components/common/launchpad-modal/launchpad-deposit-modal/LaunchpadDepositModal";
interface LaunchpadDepositModalContainerProps {
  depositAmount: string;
  poolInfo?: LaunchpadPoolModel;
  rewardInfo: ProjectRewardInfoModel;
  projectPath: string;

  refetch: () => Promise<void>;
  close: () => void;
}

const LaunchpadDepositModalContainer = ({
  depositAmount,
  poolInfo,
  rewardInfo,
  projectPath,
  refetch,
  close,
}: LaunchpadDepositModalContainerProps) => {
  return (
    <LaunchpadDepositModal
      depositAmount={depositAmount}
      poolInfo={poolInfo}
      rewardInfo={rewardInfo}
      projectPath={projectPath}
      refetch={refetch}
      close={close}
    />
  );
};

export default LaunchpadDepositModalContainer;
