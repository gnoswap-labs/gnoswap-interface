import React from "react";
import { useAtom } from "jotai";

import useCustomRouter from "@hooks/common/use-custom-router";
import { ProjectRewardInfoModel } from "../LaunchpadDetail";
import { CommonState } from "@states/index";
import { LaunchpadPoolModel } from "@models/launchpad";

import LaunchpadDepositModalContainer from "@containers/launchpad-deposit-modal-container/LaunchpadDepositModalContainer";

export interface LaunchpadDepositConfirmModalProps {
  participateAmount: string;
  poolInfo?: LaunchpadPoolModel;
  rewardInfo: ProjectRewardInfoModel;

  refetch: () => Promise<void>;
}

export interface SelectPoolDepositModalModel {
  openLaunchpadDepositModal: () => void;
  closeLaunchpadDepositModal: () => void;
}

export const useLaunchpadDepositConfirmModal = ({
  participateAmount,
  poolInfo,
  rewardInfo,
  refetch,
}: LaunchpadDepositConfirmModalProps): SelectPoolDepositModalModel => {
  const router = useCustomRouter();
  const projectPath = router.getProjectPath();
  const [, setOpenedModal] = useAtom(CommonState.openedModal);
  const [, setModalContent] = useAtom(CommonState.modalContent);

  const close = React.useCallback(() => {
    setOpenedModal(false);
    setModalContent(null);
  }, [setModalContent, setOpenedModal]);

  const openLaunchpadDepositModal = React.useCallback(() => {
    setOpenedModal(true);
    setModalContent(
      <LaunchpadDepositModalContainer
        depositAmount={participateAmount}
        poolInfo={poolInfo}
        rewardInfo={rewardInfo}
        projectPath={projectPath || ""}
        refetch={refetch}
        close={close}
      />,
    );
  }, [
    participateAmount,
    poolInfo,
    rewardInfo,
    projectPath,
    refetch,
    close,
    setModalContent,
    setOpenedModal,
  ]);

  return { openLaunchpadDepositModal, closeLaunchpadDepositModal: close };
};
