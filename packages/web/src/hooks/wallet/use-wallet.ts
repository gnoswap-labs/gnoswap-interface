import { WalletClient } from "@common/clients/wallet-client";
import { AdenaClient } from "@common/clients/wallet-client/adena";
import { WalletState } from "@states/index";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo } from "react";

export const useWallet = () => {
  const [walletClient, setWalletClient] = useAtom(WalletState.client);
  const [walletAccount, setWalletAccount] = useAtom(WalletState.account);

  const connected = useMemo(() => {
    return walletAccount !== null && walletAccount.address.length > 0;
  }, [walletAccount]);

  const wallet = useMemo(() => {
    if (!connected) {
      return null;
    }
    return walletClient;
  }, [connected, walletClient]);

  useEffect(() => {
    if (walletClient) {
      updateWalletEvents(walletClient);
    }
  }, [walletClient]);

  const connectAdenaClient = useCallback(() => {
    const adena = new AdenaClient();
    adena.initAdena();
    setWalletClient(adena);
    connectAccount(adena);
  }, [setWalletClient]);

  async function connectAccount(walletClient: WalletClient) {
    const established = await walletClient.addEstablishedSite("Gnoswap");

    if (established.code === 0 || established.code === 4001) {
      const accountResponse = await walletClient.getAccount();
      setWalletAccount(accountResponse.data);
    }
  }

  function updateWalletEvents(walletClient: WalletClient | null) {
    if (!walletClient) {
      return;
    }
    walletClient.addEventChangedAccount(connectAdenaClient);
    walletClient.addEventChangedNetwork(connectAdenaClient);
  }

  return {
    wallet,
    account: walletAccount,
    connected,
    connectAdenaClient,
  };
};
