import ConnectWalletStatusModalContainer from "@containers/connect-wallet-status-modal-container/ConnectWalletStatusModalContainer";
import { CommonState } from "@states/index";
import { useAtom } from "jotai";
import { useCallback } from "react";

export interface Props {
  openModal: () => void;
}

export const useConnectWalletStatusModal = (): Props => {
  const [, setOpenedModal] = useAtom(CommonState.openedModal);
  const [, setModalContent] = useAtom(CommonState.modalContent);

  const openModal = useCallback(() => {
    setOpenedModal(true);
    setModalContent(<ConnectWalletStatusModalContainer />);
  }, [setModalContent, setOpenedModal]);

  return {
    openModal,
  };
};
