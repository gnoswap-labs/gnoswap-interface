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
  GNOSWAP_SOCIAL_LOGIN_TYPE_KEY,
  GNOSWAP_WALLET_TYPE_KEY,
  GNOWSWAP_CONNECTED_KEY,
} from "@states/common";
import { useQueryClient } from "@tanstack/react-query";
import { SUPPORT_CHAIN_IDS, DEFAULT_CHAIN_ID } from "@constants/environment.constant";
import { useGetTokenBalancesFromChain } from "@query/address";
import { useSocialWalletContext } from "@hooks/common/use-social-wallet-context";
import { SocialLoginType } from "src/types/wallet.types";

const balanceQueryKey = ["token-balance", "ugnot"];

export const useWallet = () => {
  const { accountRepository } = useGnoswapContext();
  const { disconnect } = useSocialWalletContext();

  const [sessionId, setSessionId] = useAtom(CommonState.sessionId);
  const [walletClient, setWalletClient] = useAtom(WalletState.client);
  const [walletAccount, setWalletAccount] = useAtom(WalletState.account);
  const [, setNetwork] = useAtom(CommonState.network);
  const [loadingConnect, setLoadingConnect] = useAtom(WalletState.loadingConnect);
  const { connectSocialWalletClient } = useSocialWalletContext();
  const queryClient = useQueryClient();

  const connected = useMemo(() => {
    return walletAccount !== null && walletAccount.address.length > 0;
  }, [walletAccount]);

  const wallet = useMemo(() => {
    if (!connected) {
      return null;
    }
    return walletClient;
  }, [connected, walletClient]);

  const walletType = useMemo(() => {
    if (!walletClient) return { type: null, socialType: null };

    const currentWalletType = walletClient.getWalletType();
    return {
      type: currentWalletType,
      socialType: currentWalletType === "SOCIAL_WALLET" ? walletClient.getLoginType?.() ?? null : null,
    };
  }, [walletClient]);

  const currentChainId = useMemo(() => {
    if (!walletAccount) {
      return DEFAULT_CHAIN_ID;
    }

    return walletAccount.chainId;
  }, [walletAccount]);

  const availNetwork = useMemo(() => {
    if (!walletAccount) {
      return true;
    }

    return SUPPORT_CHAIN_IDS.includes(walletAccount.chainId);
  }, [walletAccount]);

  const isSwitchNetwork = useMemo(() => {
    if (!walletAccount) {
      return true;
    }

    return !availNetwork;
  }, [availNetwork, walletAccount]);

  const {
    data: balance,
    isLoading: isLoadingBalance,
    isStale: isBalanceStale,
    refetch,
  } = useGetTokenBalancesFromChain(currentChainId, walletAccount?.address, "ugnot", {
    enabled: !!walletAccount?.address && availNetwork,
  });

  useEffect(() => {
    if (walletClient) {
      updateWalletEvents(walletClient);
    }
  }, [walletClient]);

  useEffect(() => {
    if (walletAccount) {
      const network = NetworkData.find(network => network.chainId === walletAccount.chainId);
      if (network) {
        setNetwork(network);
      }
    }
  }, [setNetwork, walletAccount]);

  const disconnectWallet = useCallback(() => {
    disconnect();
    setWalletClient(null);
    setWalletAccount(null);
    setSessionId("");
    sessionStorage.removeItem(GNOSWAP_SESSION_ID_KEY);
    sessionStorage.removeItem(ACCOUNT_SESSION_INFO_KEY);
    sessionStorage.removeItem(GNOWSWAP_CONNECTED_KEY);
    sessionStorage.removeItem(GNOSWAP_WALLET_TYPE_KEY);
    sessionStorage.removeItem(GNOSWAP_SOCIAL_LOGIN_TYPE_KEY);
    accountRepository.setConnectedWallet(false);
    setLoadingConnect("initial");
  }, [accountRepository]);

  async function initSession() {
    try {
      const savedAccount = sessionStorage.getItem(ACCOUNT_SESSION_INFO_KEY);
      const savedWalletType = sessionStorage.getItem(GNOSWAP_WALLET_TYPE_KEY);
      const savedSocialLoginType = sessionStorage.getItem(GNOSWAP_SOCIAL_LOGIN_TYPE_KEY);

      if (!savedAccount || !savedWalletType) return;

      if (savedWalletType === "SOCIAL_WALLET" && savedSocialLoginType) {
        await connectSocialWalletClient(savedSocialLoginType as SocialLoginType);
        return;
      }

      if (savedWalletType === "ADENA") {
        const adena = AdenaClient.createAdenaClient();
        const data = await adena?.getAccount();
        if (data?.status === "failure") {
          disconnectWallet();
          return;
        }
      }

      if (walletClient === null) {
        connectAdenaClient();
      }
    } catch (err) {
      console.log(err);
    }
  }

  const switchNetwork = async (network?: string) => {
    try {
      setLoadingConnect("loading");
      const res = await accountRepository.switchNetwork(network || DEFAULT_CHAIN_ID);
      if (res.code === 0) {
        const account = await accountRepository.getAccount();
        setWalletAccount(account);
        accountRepository.setConnectedWallet(true);
      }
      setLoadingConnect("done");
    } catch {
      const currentWalletType = sessionStorage.getItem(GNOSWAP_WALLET_TYPE_KEY);
      const savedSocialLoginType = sessionStorage.getItem(GNOSWAP_SOCIAL_LOGIN_TYPE_KEY);

      // initialize Adena-client or Social-wallet-client
      if (currentWalletType === "SOCIAL_WALLET" && savedSocialLoginType) {
        await connectSocialWalletClient(savedSocialLoginType as SocialLoginType);
      } else if (walletType.type === "ADENA") {
        connectAdenaClient();
      }
    }
  };

  const connectAdenaClient = useCallback(() => {
    if (loadingConnect !== "initial") {
      setLoadingConnect("loading");
    }
    const adena = AdenaClient.createAdenaClient();
    if (adena !== null) {
      sessionStorage.setItem(GNOSWAP_WALLET_TYPE_KEY, "ADENA");
      adena.initAdena();
    } else {
      window.open("https://adena.app/", "", "noopener,noreferrer");
    }
    setWalletClient(adena);
  }, [sessionId, loadingConnect]);

  const connectAccount = async () => {
    try {
      setLoadingConnect("loading");

      const adena = AdenaClient.createAdenaClient();
      setWalletClient(adena);

      const established = await accountRepository.addEstablishedSite().catch(() => null);

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
        sessionStorage.setItem(GNOSWAP_WALLET_TYPE_KEY, "ADENA");
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
      console.error(error);
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
    } catch {}
  }

  useEffect(() => {
    if (!sessionId) {
      const sessionId = uuid.v4();
      setSessionId(sessionId);
      sessionStorage.setItem(GNOSWAP_SESSION_ID_KEY, sessionId);
    }
  }, [walletClient]);

  return {
    wallet,
    walletType,
    account: walletAccount,
    connected,
    availNetwork,
    currentChainId,
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
    refetchGnotBalance: refetch,
  };
};
