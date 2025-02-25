import React from "react";
import { useAtom } from "jotai";

import { CommonState } from "@states/index";
import { useClearModal } from "@hooks/common/use-clear-modal";

import ConnectSocialWalletContainer from "@containers/connect-wallet-container/ConnectSocialWalletContainer";
import { SocialWalletLoginType } from "@providers/social-wallet-provider";

interface Props {
  openModal: (loginType: SocialWalletLoginType) => void;
  closeModal: () => void;
}

export const useConnectSocialWalletModal = (): Props => {
  const [, setOpenedModal] = useAtom(CommonState.openedModal);
  const [, setModalContent] = useAtom(CommonState.modalContent);

  const clearModal = useClearModal();

  const closeModal = React.useCallback(() => {
    clearModal();
  }, [clearModal]);

  const openModal = React.useCallback(
    (loginType: SocialWalletLoginType) => {
      setOpenedModal(true);
      setModalContent(<ConnectSocialWalletContainer loginType={loginType} />);
    },
    [setOpenedModal, setModalContent],
  );

  return { openModal, closeModal };
};
