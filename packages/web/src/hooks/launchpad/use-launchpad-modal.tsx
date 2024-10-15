import React from "react";
import { useAtom } from "jotai";

import { CommonState } from "@states/index";
import LaunchpadDepositModalContainer from "@containers/launchpad-deposit-modal-container/LaunchpadDepositModalContainer";
import LaunchpadClaimAllModalContainer from "@containers/launchpad-claim-all-modal-container/LaunchpadClaimAllModalContainer";
import LaunchpadWaitingConfirmationModalContainer from "@containers/launchpad-waiting-confirmation-modal-container/LaunchpadWaitingConfirmationModalContainer";

export const useLaunchpadModal = () => {
  const [, setOpenedModal] = useAtom(CommonState.openedModal);
  const [, setModalcontent] = useAtom(CommonState.modalContent);

  const openLaunchpadDepositModal = React.useCallback(() => {
    setOpenedModal(true);
    setModalcontent(<LaunchpadDepositModalContainer />);
  }, [setOpenedModal, setModalcontent]);

  const openLaunchpadClaimAllModal = React.useCallback(() => {
    setOpenedModal(true);
    setModalcontent(<LaunchpadClaimAllModalContainer />);
  }, [[setOpenedModal, setModalcontent]]);

  const openLaunchpadWaitingConfirmationModal = React.useCallback(() => {
    setOpenedModal(true);
    setModalcontent(<LaunchpadWaitingConfirmationModalContainer />);
  }, [setOpenedModal, setModalcontent]);

  return {
    openLaunchpadDepositModal,
    openLaunchpadClaimAllModal,
    openLaunchpadWaitingConfirmationModal,
  };
};
