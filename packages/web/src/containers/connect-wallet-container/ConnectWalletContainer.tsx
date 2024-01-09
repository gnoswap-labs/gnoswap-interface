import ConnectWalletModal from "@components/common/connect-wallet-modal/ConnectWalletModal";
import { useClearModal } from "@hooks/common/use-clear-modal";
import { useConnectWalletStatusModal } from "@hooks/wallet/use-connect-status-wallet-modal";
import { useWallet } from "@hooks/wallet/use-wallet";
import React, { useCallback, useEffect } from "react";

const ConnectWalletContainer = () => {
  const clearModal = useClearModal();
  const { connectAdenaClient, loadingConnect, connectAccount, walletClient } = useWallet();

  const { openModal } = useConnectWalletStatusModal();

  const close = useCallback(() => {
    clearModal();
  }, [clearModal]);
  
  useEffect(() => {
    if (loadingConnect === "error") {
      openModal();
    } else if (loadingConnect === "done") {
      close();
    }
  }, [loadingConnect, close, openModal]);

  const connect = useCallback(() => {
    if (walletClient) {
      connectAccount();
    } else {
      connectAdenaClient();
    }
  }, [connectAdenaClient, close, walletClient]);
  
  return <ConnectWalletModal close={close} connect={connect} loadingConnect={loadingConnect} />;
};

export default ConnectWalletContainer;
