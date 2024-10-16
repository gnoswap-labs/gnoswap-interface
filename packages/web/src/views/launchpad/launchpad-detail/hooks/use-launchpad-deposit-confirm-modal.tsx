import React from "react";
import { useAtom } from "jotai";

import { CommonState } from "@states/index";
import { LaunchpadPoolModel } from "@models/launchpad";

import LaunchpadDepositModalContainer from "@containers/launchpad-deposit-modal-container/LaunchpadDepositModalContainer";
import useCustomRouter from "@hooks/common/use-custom-router";

export interface LaunchpadDepositConfirmModalProps {
  participateAmount: string;
  poolInfo?: LaunchpadPoolModel;

  refetch: () => Promise<void>;
}

export interface SelectPoolDepositModalModel {
  openLaunchpadDepositModal: () => void;
}

export const useLaunchpadDepositConfirmModal = ({
  participateAmount,
  poolInfo,
  refetch,
}: LaunchpadDepositConfirmModalProps): SelectPoolDepositModalModel => {
  const router = useCustomRouter();
  const projectPath = router.getProjectPath();
  const [, setOpenedModal] = useAtom(CommonState.openedModal);
  const [, setModalContent] = useAtom(CommonState.modalContent);
  const openLaunchpadDepositModal = React.useCallback(() => {
    setOpenedModal(true);
    setModalContent(
      <LaunchpadDepositModalContainer
        depositAmount={participateAmount}
        poolInfo={poolInfo}
        projectPath={projectPath || ""}
        refetch={refetch}
      />,
    );
  }, [participateAmount, poolInfo, projectPath, refetch]);

  // const close = React.useCallback(() => {
  //   setOpenedModal(false);
  //   setModalContent(null);
  // }, [setModalContent, setOpenedModal]);

  return { openLaunchpadDepositModal };
};
