import ConnectWalletContainer from "@containers/connect-wallet-container/ConnectWalletContainer";
import { CommonState } from "@states/index";
import { useAtom } from "jotai";
import { useCallback } from "react";

export interface Props {
  openModal: () => void;
}

export const useConnectWalletModal = (): Props => {
  const [, setOpenedModal] = useAtom(CommonState.openedModal);
  const [, setModalContent] = useAtom(CommonState.modalContent);

  const openModal = useCallback(() => {
    setOpenedModal(true);
    setModalContent(<ConnectWalletContainer />);
  }, [setModalContent, setOpenedModal]);

  return {
    openModal,
  };
};
