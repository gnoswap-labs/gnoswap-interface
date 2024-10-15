import React from "react";
import { useAtom } from "jotai";

import { CommonState } from "@states/index";
import LaunchpadDepositModalContainer from "@containers/launchpad-deposit-modal-container/LaunchpadDepositModalContainer";
import LaunchpadClaimAllModalContainer from "@containers/launchpad-claim-all-modal-container/LaunchpadClaimAllModalContainer";

export const useLaunchpadDepositModal = () => {
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

  return {
    openLaunchpadDepositModal,
    openLaunchpadClaimAllModal,
  };
};
