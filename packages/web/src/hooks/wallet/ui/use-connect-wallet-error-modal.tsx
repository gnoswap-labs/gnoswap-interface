import React from "react";
import { useAtom } from "jotai";

import { CommonState } from "@states/index";

import ConnectWalletErrorModal from "@components/common/connect-wallet-modal/connect-wallet-error-modal/ConnectWalletErrorModal";
import { useClearModal } from "@hooks/common/use-clear-modal";

export interface ModalControls {
  openModal: () => void;
}

export const useConnectWalletErrorModal = (): ModalControls => {
  const [, setOpenedModal] = useAtom(CommonState.openedModal);
  const [, setModalContent] = useAtom(CommonState.modalContent);

  const clearModal = useClearModal();

  const closeModal = React.useCallback(() => {
    clearModal();
  }, [clearModal]);

  const openModal = React.useCallback(() => {
    setOpenedModal(true);
    setModalContent(<ConnectWalletErrorModal close={closeModal} />);
  }, [setModalContent, setOpenedModal]);

  return {
    openModal,
  };
};
