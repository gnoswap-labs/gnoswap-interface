import ConnectWalletContainer from "@containers/connect-wallet-container/ConnectWalletContainer";
import { CommonState } from "@states/index";
import { useSetAtom } from "jotai";
import { useCallback } from "react";
import { useWallet } from "../data/use-wallet";

export interface Props {
  openModal: () => void;
}

export const useConnectWalletModal = (): Props => {
  const setOpenedModal = useSetAtom(CommonState.openedModal);
  const setModalContent = useSetAtom(CommonState.modalContent);

  const { resetWeb3authSession } = useWallet();

  const openModal = useCallback(() => {
    resetWeb3authSession();
    setOpenedModal(true);
    setModalContent(<ConnectWalletContainer />);
  }, [setModalContent, setOpenedModal]);

  return {
    openModal,
  };
};
