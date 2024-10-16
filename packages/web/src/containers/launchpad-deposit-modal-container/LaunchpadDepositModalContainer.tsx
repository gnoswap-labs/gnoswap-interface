import React from "react";

import LaunchpadDepositModal from "@components/common/launchpad-modal/launchpad-deposit-modal/LaunchpadDepositModal";
import { LaunchpadPoolModel } from "@models/launchpad";
interface LaunchpadDepositModalContainerProps {
  depositAmount: string;
  poolInfo?: LaunchpadPoolModel;
  projectPath: string;

  refetch: () => Promise<void>;
}

const LaunchpadDepositModalContainer = ({
  depositAmount,
  poolInfo,
  projectPath,
  refetch,
}: LaunchpadDepositModalContainerProps) => {
  return (
    <LaunchpadDepositModal
      depositAmount={depositAmount}
      poolInfo={poolInfo}
      projectPath={projectPath}
      refetch={refetch}
    />
  );
};

export default LaunchpadDepositModalContainer;
