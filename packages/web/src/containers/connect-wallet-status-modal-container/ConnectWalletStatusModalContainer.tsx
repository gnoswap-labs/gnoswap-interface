import ConnectWalletStatusModal from "@components/common/connect-wallet-status-modal/ConnectWalletStatusModal";
import { useClearModal } from "@hooks/common/use-clear-modal";
import { useWallet } from "@hooks/wallet/use-wallet";
import React, { useCallback, useEffect } from "react";

const ConnectWalletStatusModalContainer = () => {
  const clearModal = useClearModal();
  const { connectAdenaClient, loadingConnect } = useWallet();

  const close = useCallback(() => {
    clearModal();
  }, [clearModal]);
  
  useEffect(() => {
    if (loadingConnect === "done") {
      close();
    }
  }, [loadingConnect, close]);

  const connect = useCallback(() => {
    connectAdenaClient();
  }, [connectAdenaClient, close]);
  
  return <ConnectWalletStatusModal close={close} connect={connect} />;
};

export default ConnectWalletStatusModalContainer;
