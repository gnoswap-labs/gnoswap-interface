import ConnectWalletModal from "@components/common/connect-wallet-modal-test/ConnectWalletModal";
import { useClearModal } from "@hooks/common/use-clear-modal";
import { useWallet } from "@hooks/wallet/use-wallet";
import React, { useCallback } from "react";

const ConnectWalletContainer = () => {
  const clearModal = useClearModal();
  const { connectAdenaClient } = useWallet();

  const close = useCallback(() => {
    clearModal();
  }, [clearModal]);

  const connect = useCallback(() => {
    connectAdenaClient();
    close();
  }, [connectAdenaClient, close]);
  
  return <ConnectWalletModal close={close} connect={connect}/>;
};

export default ConnectWalletContainer;
