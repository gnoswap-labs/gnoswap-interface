// import { network } from './../../states/common';
import { WalletClient } from "@common/clients/wallet-client";
import { AdenaClient } from "@common/clients/wallet-client/adena";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { CommonState, WalletState } from "@states/index";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo } from "react";
import NetworkData from "@resources/chains.json";
import { DEFAULT_NETWORK_ID } from "@constants/common.constant";
import * as uuid from "uuid";
import { GNOSWAP_SESSION_ID_KEY } from "@states/common";

const CHAIN_ID = process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID || DEFAULT_NETWORK_ID;

export const useWallet = () => {
  const { accountRepository } = useGnoswapContext();
  const [sessionId, setSessionId] = useAtom(CommonState.sessionId);
  const [walletClient, setWalletClient] = useAtom(WalletState.client);
  const [walletAccount, setWalletAccount] = useAtom(WalletState.account);
  const [, setNetwork] = useAtom(CommonState.network);
  const [loadingConnect, setLoadingConnect] = useAtom(
    WalletState.loadingConnect,
  );
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

  async function initSession() {
    try {
      const connectedBySession = sessionId;
      if (!connectedBySession) return;

      const adena = AdenaClient.createAdenaClient();
      const data = await adena?.getAccount();
      if (data?.status === "failure") return;

      if (walletClient === null) {
        connectAdenaClient();
      }
    } catch (err) {
      console.log(err);
    }
  }

  const switchNetwork = useCallback(async () => {
    setLoadingConnect("loading");
    const res = await accountRepository.switchNetwork(CHAIN_ID);
    if (res.code === 0) {
      const account = await accountRepository.getAccount();
      setWalletAccount(account);
      accountRepository.setConnectedWallet(true);
    }
    setLoadingConnect("done");
  }, [accountRepository, setWalletAccount]);

  const connectAdenaClient = useCallback(() => {
    const connectedBySession = sessionId;
    if (!connectedBySession) {
      setLoadingConnect("loading");
    }
    const adena = AdenaClient.createAdenaClient();
    if (adena !== null) {
      adena.initAdena();
    } else {
      window.open("https://adena.app/");
    }
    setWalletClient(adena);
  }, [sessionId, setWalletClient, setLoadingConnect]);

  const connectAccount = async () => {
    const established = await accountRepository
      .addEstablishedSite()
      .catch(() => null);

    if (established === null) {
      return;
    }

    if (established.code === 0 || established.code === 4001) {
      const account = await accountRepository.getAccount();
      const network = account.chainId === CHAIN_ID;
      if (!network) {
        switchNetwork();
      }
      setWalletAccount(account);
      accountRepository.setConnectedWallet(true);
      setLoadingConnect("done");
    } else {
      accountRepository.setConnectedWallet(false);
      setLoadingConnect("error");
    }
  };

  const disconnectWallet = useCallback(() => {
    setWalletAccount(null);
    setSessionId("");
    sessionStorage.removeItem(GNOSWAP_SESSION_ID_KEY);
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

  const isSwitchNetwork = useMemo(() => {
    if (!walletAccount) return true;
    const network = walletAccount.chainId === CHAIN_ID;
    return network ? false : true;
  }, [walletAccount]);

  useEffect(() => {
    if (!sessionId) {
      const sessionId = uuid.v4();
      setSessionId(sessionId);
      sessionStorage.setItem(GNOSWAP_SESSION_ID_KEY, sessionId);
    }
  }, [walletClient]);

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
    isSwitchNetwork: isSwitchNetwork,
    loadingConnect,
  };
};
