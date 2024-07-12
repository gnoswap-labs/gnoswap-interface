import { WalletClient } from "@common/clients/wallet-client";
import { AdenaClient } from "@common/clients/wallet-client/adena";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { CommonState, WalletState } from "@states/index";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo } from "react";
import { NetworkData } from "@constants/chains.constant";
import * as uuid from "uuid";
import {
  ACCOUNT_SESSION_INFO_KEY,
  GNOSWAP_SESSION_ID_KEY,
  GNOWSWAP_CONNECTED_KEY,
} from "@states/common";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SUPPORT_CHAIN_IDS, DEFAULT_CHAIN_ID } from "@constants/environment.constant";

const balanceQueryKey = ["token-balance", "ugnot"];

export const useWallet = () => {
  const { accountRepository } = useGnoswapContext();
  const [sessionId, setSessionId] = useAtom(CommonState.sessionId);
  const [walletClient, setWalletClient] = useAtom(WalletState.client);
  const [walletAccount, setWalletAccount] = useAtom(WalletState.account);
  const [, setNetwork] = useAtom(CommonState.network);
  const [loadingConnect, setLoadingConnect] = useAtom(
    WalletState.loadingConnect,
  );
  const { rpcProvider } = useGnoswapContext();
  const queryClient = useQueryClient();

  const connected = useMemo(() => {
    return walletAccount !== null && walletAccount.address.length > 0;
  }, [walletAccount]);

  const balanceQuery = useQuery({
    queryKey: [balanceQueryKey, walletAccount?.chainId || ""],
    queryFn: () =>
      rpcProvider?.getBalance(walletAccount?.address || "", "ugnot"),
    refetchInterval: 5_000,
    enabled: !!walletAccount?.address,
  });
  const {
    data: balance,
    isLoading: isLoadingBalance,
    isStale: isBalanceStale,
  } = balanceQuery;

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

  const disconnectWallet = useCallback(() => {
    setWalletAccount(null);
    setSessionId("");
    sessionStorage.removeItem(GNOSWAP_SESSION_ID_KEY);
    sessionStorage.removeItem(ACCOUNT_SESSION_INFO_KEY);
    sessionStorage.removeItem(GNOWSWAP_CONNECTED_KEY);
    accountRepository.setConnectedWallet(false);
    setLoadingConnect("initial");
  }, [accountRepository, setWalletAccount]);

  async function initSession() {
    try {
      const adena = AdenaClient.createAdenaClient();
      const data = await adena?.getAccount();
      if (data?.status === "failure") {
        disconnectWallet();
        return;
      }

      if (walletClient === null) {
        connectAdenaClient();
      }
    } catch (err) {
      console.log(err);
    }
  }

  const switchNetwork = useCallback(async (network?: string) => {
    try {
      setLoadingConnect("loading");
      const res = await accountRepository.switchNetwork(network || DEFAULT_CHAIN_ID);
      if (res.code === 0) {
        const account = await accountRepository.getAccount();
        setWalletAccount(account);
        accountRepository.setConnectedWallet(true);
      }
      setLoadingConnect("done");
    } catch (error) {
    }
  }, [accountRepository, setWalletAccount]);

  const connectAdenaClient = useCallback(() => {
    if (loadingConnect !== "initial") {
      setLoadingConnect("loading");
    }
    const adena = AdenaClient.createAdenaClient();
    if (adena !== null) {
      adena.initAdena();
    } else {
      window.open("https://adena.app/");
    }
    setWalletClient(adena);
  },
    [sessionId, setWalletClient, setLoadingConnect],
  );

  const connectAccount = async () => {
    try {
      setLoadingConnect("loading");
      const established = await accountRepository
        .addEstablishedSite()
        .catch(() => null);

      if (established === null) {
        return;
      }
      if (established.code === 4000) {
        disconnectWallet();
        return;
      }

      if (established.code === 0 || established.code === 4001) {
        const account = await accountRepository.getAccount();
        sessionStorage.setItem(ACCOUNT_SESSION_INFO_KEY, JSON.stringify(account));
        const availNetwork = SUPPORT_CHAIN_IDS.includes(account.chainId);
        if (!availNetwork) {
          switchNetwork();
        }
        setWalletAccount(account);
        accountRepository.setConnectedWallet(true);
        setLoadingConnect("done");
      } else {
        accountRepository.setConnectedWallet(false);
        setLoadingConnect("error");
      }
    } catch (error) {
    }

  };

  function updateWalletEvents(walletClient: WalletClient | null) {
    if (!walletClient) {
      return;
    }
    try {
      walletClient.addEventChangedAccount(() => {
        queryClient.invalidateQueries({
          queryKey: balanceQueryKey,
        });
        connectAdenaClient();
      });
      walletClient.addEventChangedNetwork(() => {
        connectAdenaClient();
      });
    } catch { }
  }

  const isSwitchNetwork = useMemo(() => {
    if (!walletAccount) return true;
    const availNetwork = SUPPORT_CHAIN_IDS.includes(walletAccount.chainId);
    return availNetwork ? false : true;
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
    isSwitchNetwork,
    loadingConnect,
    walletClient,
    setLoadingConnect,
    gnotBalance: balance,
    isLoadingGnotBalance: isLoadingBalance || isBalanceStale,
  };
};
