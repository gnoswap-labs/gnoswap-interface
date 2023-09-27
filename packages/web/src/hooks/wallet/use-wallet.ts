import { WalletClient } from "@common/clients/wallet-client";
import { AdenaClient } from "@common/clients/wallet-client/adena";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { WalletState } from "@states/index";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo } from "react";

export const useWallet = () => {
  const { accountRepository } = useGnoswapContext();
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
      initSession();
      updateWalletEvents(walletClient);
    }
  }, [walletClient]);

  function initSession() {
    const connectedBySession = accountRepository.isConnectedWalletBySession();
    if (connectedBySession) {
      connectAdenaClient();
    }
  }

  const connectAdenaClient = useCallback(() => {
    const adena = new AdenaClient();
    adena.initAdena();
    setWalletClient(adena);
    connectAccount();
  }, [setWalletClient]);

  async function connectAccount() {
    const established = await accountRepository.addEstablishedSite();

    if (established.code === 0 || established.code === 4001) {
      const account = await accountRepository.getAccount();
      setWalletAccount(account);
      accountRepository.setConnectedWallet(true);
    } else {
      accountRepository.setConnectedWallet(false);
    }
  }

  const disconnectWallet = useCallback(() => {
    setWalletAccount(null);
    accountRepository.setConnectedWallet(false);
  }, [accountRepository, setWalletAccount]);

  function updateWalletEvents(walletClient: WalletClient | null) {
    if (!walletClient) {
      return;
    }
    try {
      walletClient.addEventChangedAccount(connectAdenaClient);
      walletClient.addEventChangedNetwork(connectAdenaClient);
    } catch {
      setWalletClient(new AdenaClient());
    }
  }

  return {
    wallet,
    account: walletAccount,
    connected,
    initSession,
    connectAdenaClient,
    disconnectWallet,
  };
};
