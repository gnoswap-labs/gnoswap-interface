import ConnectWalletModal from "@components/common/connect-wallet-modal/ConnectWalletModal";
import { useClearModal } from "@hooks/common/use-clear-modal";
import { useConnectWalletStatusModal } from "@hooks/wallet/ui/use-connect-status-wallet-modal";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { useCallback, useEffect } from "react";
import useRouter from "@hooks/common/use-custom-router";

const ConnectWalletContainer = () => {
  const clearModal = useClearModal();
  const { connectAdenaClient, loadingConnect, connectAccount, walletClient } = useWallet();
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
      connectAccount(walletClient);
    } else {
      const adena = connectAdenaClient();
      if (adena !== null) {
        connectAccount(adena);
      }
    }
  }, [connectAdenaClient, connectAccount, walletClient]);

  return <ConnectWalletModal close={close} connect={connect} loadingConnect={loadingConnect} />;
};

export default ConnectWalletContainer;
