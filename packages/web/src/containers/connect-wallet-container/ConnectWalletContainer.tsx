import ConnectWalletModal from "@components/common/connect-wallet-modal/ConnectWalletModal";
import { useClearModal } from "@hooks/common/use-clear-modal";
import { useConnectWalletStatusModal } from "@hooks/wallet/use-connect-status-wallet-modal";
import { useWallet } from "@hooks/wallet/use-wallet";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";

const ConnectWalletContainer = () => {
  const clearModal = useClearModal();
  const { connectAdenaClient, loadingConnect, connectAccount, walletClient } = useWallet();
  const [connectWallet, setConnectWallet] = useState(false);
  const router = useRouter();

  const { openModal } = useConnectWalletStatusModal();

  const close = useCallback(() => {
    clearModal();
  }, [clearModal]);
  
  useEffect(() => {
    if (loadingConnect === "error") {
      openModal();
    } else if (loadingConnect === "done") {
      close();
      if (router.pathname === "/earn") {
        router.push("/earn");
      }
    }
  }, [loadingConnect, close, openModal]);

  const connect = useCallback(() => {
    if (walletClient) {
      connectAccount();
    } else {
      connectAdenaClient();
      setConnectWallet(true);
    }
  }, [connectAdenaClient, close]);
  
  useEffect(() => {
    if (connectWallet && walletClient) {
      connectAccount();
      setConnectWallet(false);
    }
  }, [connectWallet, String(walletClient)]);
  
  return <ConnectWalletModal close={close} connect={connect} loadingConnect={loadingConnect} />;
};

export default ConnectWalletContainer;
