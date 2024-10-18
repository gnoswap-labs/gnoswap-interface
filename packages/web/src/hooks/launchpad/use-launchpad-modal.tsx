import React from "react";
import { useAtom } from "jotai";

import { CommonState } from "@states/index";

import LaunchpadWaitingConfirmationModalContainer from "@containers/launchpad-waiting-confirmation-modal-container/LaunchpadWaitingConfirmationModalContainer";

export const useLaunchpadModal = () => {
  const [, setOpenedModal] = useAtom(CommonState.openedModal);
  const [, setModalcontent] = useAtom(CommonState.modalContent);

  const openLaunchpadWaitingConfirmationModal = React.useCallback(() => {
    setOpenedModal(true);
    setModalcontent(<LaunchpadWaitingConfirmationModalContainer />);
  }, [setOpenedModal, setModalcontent]);

  return {
    openLaunchpadWaitingConfirmationModal,
  };
};
