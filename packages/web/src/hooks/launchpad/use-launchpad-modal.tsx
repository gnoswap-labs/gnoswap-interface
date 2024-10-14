import React from "react";
import { useAtom } from "jotai";

import { CommonState } from "@states/index";
import LaunchpadModalContainer from "@containers/launchpad-modal-container/LaunchpadModalContainer";

export const useLaunchpadModal = () => {
  const [, setOpenedModal] = useAtom(CommonState.openedModal);
  const [, setModalcontent] = useAtom(CommonState.modalContent);

  const openModal = React.useCallback(() => {
    setOpenedModal(true);
    setModalcontent(<LaunchpadModalContainer />);
  }, [setOpenedModal, setModalcontent]);

  return {
    openModal,
  };
};
