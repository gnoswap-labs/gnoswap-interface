import React from "react";

import { useClearModal } from "@hooks/common/use-clear-modal";
import ConnectSocialWalletModal from "@components/common/connect-social-wallet-modal/ConnectSocialWalletModal";
import { SocialWalletLoginType } from "@providers/social-wallet-provider";

interface ConnectSocialWalletContainerProps {
  loginType: SocialWalletLoginType;
}

const ConnectSocialWalletContainer = ({ loginType }: ConnectSocialWalletContainerProps) => {
  const clearModal = useClearModal();

  const close = React.useCallback(() => {
    clearModal();
  }, [clearModal]);

  return <ConnectSocialWalletModal close={close} loginType={loginType} />;
};

export default ConnectSocialWalletContainer;
