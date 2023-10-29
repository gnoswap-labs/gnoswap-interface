import { WalletClient } from "@common/clients/wallet-client";
import { AdenaClient } from "@common/clients/wallet-client/adena";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { CommonState, WalletState } from "@states/index";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo } from "react";
import NetworkData from "@resources/chains.json";
import { ERROR_VALUE } from "@common/errors/adena";

const CHAIN_ID = process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID || "";

export const useWallet = () => {
  const { accountRepository } = useGnoswapContext();
  const [walletClient, setWalletClient] = useAtom(WalletState.client);
  const [walletAccount, setWalletAccount] = useAtom(WalletState.account);
  const [, setNetwork] = useAtom(CommonState.network);
  const [wrongNetworkModal, setWrongNetworkModal] = useAtom(CommonState.wrongNetworkModal);

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

  useEffect(() => {
    if (walletAccount) {
      const network = NetworkData.find(
        network => network.chainId === walletAccount.chainId,
      );
      if (network) {
        setNetwork(network);
      }
    }
  }, [setNetwork, walletAccount]);

  function initSession() {
    const connectedBySession = accountRepository.isConnectedWalletBySession();
    if (connectedBySession) {
      connectAdenaClient();
    }
  }

  const connectAdenaClient = useCallback(() => {
    const adena = AdenaClient.createAdenaClient();
    if (adena !== null) {
      adena.initAdena();
    }
    setWalletClient(adena);
  }, [setWalletClient]);

  const connectAccount = useCallback(async () => {
    const established = await accountRepository
      .addEstablishedSite()
      .catch(() => null);

    if (established === null) {
      return;
    }

    if (established.code === 0 || established.code === 4001) {
      const account = await accountRepository.getAccount();
      if (account.chainId !== CHAIN_ID) {
        setWrongNetworkModal(true);
      }      
      setWalletAccount(account);
      accountRepository.setConnectedWallet(true);
    } else {
      accountRepository.setConnectedWallet(false);
    }
  }, [accountRepository, setWalletAccount]);

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
    } catch {}
  }

  const switchNetwork = useCallback(
    async () => {
      const res = await accountRepository.switchNetwork("dev.gnoswap");
      if (
        res.code === ERROR_VALUE["SWITCH_NETWORK_REJECTED"].status &&
        res.type === ERROR_VALUE["SWITCH_NETWORK_REJECTED"].type &&
        !wrongNetworkModal
      ) {
        setWrongNetworkModal(true);
      } else {
        const account = await accountRepository.getAccount();
        setWalletAccount(account);
        accountRepository.setConnectedWallet(true);
        setWrongNetworkModal(false);
      }
    },
    [accountRepository]
  );

  return {
    wallet,
    account: walletAccount,
    connected,
    connectAccount,
    initSession,
    connectAdenaClient,
    updateWalletEvents,
    disconnectWallet,
    switchNetwork,
  };
};
