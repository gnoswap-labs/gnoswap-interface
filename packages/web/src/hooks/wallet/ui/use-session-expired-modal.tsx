import React from "react";
import { useAtom } from "jotai";

import { CommonState } from "@states/index";
import SessionExpiredModal from "@components/common/session-expired-modal/SessionExpiredModal";
import { useClearModal } from "@hooks/common/use-clear-modal";

interface ModalControls {
  openModal: () => void;
}

export const useSessionExpiredModal = (): ModalControls => {
  const [, setOpenedModal] = useAtom(CommonState.openedModal);
  const [, setModalContent] = useAtom(CommonState.modalContent);

  const clearModal = useClearModal();

  const closeModal = React.useCallback(() => {
    clearModal();
  }, [clearModal]);

  const openModal = React.useCallback(() => {
    setOpenedModal(true);
    setModalContent(<SessionExpiredModal close={closeModal} />);
  }, [setOpenedModal, setModalContent]);

  return {
    openModal,
  };
};
