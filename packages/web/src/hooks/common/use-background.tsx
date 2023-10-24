import { useEffect } from "react";
import { useWallet } from "@hooks/wallet/use-wallet";
import { useAtom } from "jotai";
import { WalletState } from "@states/index";

export const useBackground = () => {

  const [walletClient] = useAtom(WalletState.client);
  const { initSession, connectAccount, updateWalletEvents } = useWallet();

  useEffect(() => {
    initSession();
  }, []);

  useEffect(() => {
    if (walletClient) {
      connectAccount();
      updateWalletEvents(walletClient);
    }
  }, [walletClient]);

};
