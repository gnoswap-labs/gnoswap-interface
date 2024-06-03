import { useAtom } from "jotai";
import { CommonState, WalletState } from "@states/index";
import { useCallback } from "react";

export const useClearModal = () => {
  const [, setOpenedModal] = useAtom(CommonState.openedModal);
  const [, setModalContent] = useAtom(CommonState.modalContent);
  const [, setWalletAccount] = useAtom(WalletState.loadingConnect);

  const clear = useCallback(() => {
    setOpenedModal(false);
    setModalContent(null);
    setWalletAccount("initial");
  }, [setOpenedModal, setModalContent]);

  return clear;
};
