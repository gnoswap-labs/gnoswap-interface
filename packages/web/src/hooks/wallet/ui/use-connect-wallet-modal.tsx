import ConnectWalletContainer from "@containers/connect-wallet-container/ConnectWalletContainer";
import { CommonState } from "@states/index";
import { useAtom } from "jotai";
import { useCallback } from "react";
import { useWallet } from "../data/use-wallet";

export interface Props {
  openModal: () => void;
}

export const useConnectWalletModal = (): Props => {
  const [, setOpenedModal] = useAtom(CommonState.openedModal);
  const [, setModalContent] = useAtom(CommonState.modalContent);

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
