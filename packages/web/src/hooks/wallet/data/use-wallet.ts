import { WalletClient } from "@common/clients/wallet-client";
import { AdenaClient } from "@common/clients/wallet-client/adena";
import { NetworkData } from "@constants/chains.constant";
import { DEFAULT_CHAIN_ID, SUPPORT_CHAIN_IDS } from "@constants/environment.constant";
import { AUTH_STORE_KEY } from "@hooks/common/use-auto-disconnect";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useSocialWalletContext } from "@hooks/common/use-social-wallet-context";
import { AdenaError } from "@common/errors/adena";
import { AccountMapper } from "@models/account/mapper/account-mapper";
import { useGetTokenBalancesFromChain } from "@query/address";
import {
  ACCOUNT_SESSION_INFO_KEY,
  ADENA_SDK_CONNECTION_STATE_KEY,
  GNOSWAP_SESSION_ID_KEY,
  GNOSWAP_SOCIAL_LOGIN_TYPE_KEY,
  GNOSWAP_WALLET_TYPE_KEY,
  GNOWSWAP_CONNECTED_KEY,
} from "@states/common";
import { CommonState, WalletState } from "@states/index";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo } from "react";
import { AdenaSdkConnectionState, SocialLoginType, WalletType } from "src/types/wallet.types";
import * as uuid from "uuid";
import { isWalletLockedError, isWalletLockedResponse } from "./use-wallet.util";

const balanceQueryKey = ["token-balance", "ugnot"];
const GNOT_BALANCE_REFETCH_INTERVAL = 5_000;
const defaultGnoswapMemo = "Executed through gnoswap.io";
let connectingAdenaAccount = false;

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

  const { data: balance, isLoading: isLoadingBalance, isStale: isBalanceStale, refetch } = useGetTokenBalancesFromChain(
    currentChainId,
    walletAccount?.address,
    "ugnot",
    {
      enabled: !!walletAccount?.address && availNetwork,
      refetchInterval: GNOT_BALANCE_REFETCH_INTERVAL,
    },
  );

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

  const disconnectWallet = useCallback(async () => {
    setWalletClient(null);
    setWalletAccount(null);
    setSessionId("");
    sessionStorage.removeItem(GNOSWAP_SESSION_ID_KEY);
    sessionStorage.removeItem(ACCOUNT_SESSION_INFO_KEY);
    sessionStorage.removeItem(GNOWSWAP_CONNECTED_KEY);
    sessionStorage.removeItem(GNOSWAP_WALLET_TYPE_KEY);
    sessionStorage.removeItem(GNOSWAP_SOCIAL_LOGIN_TYPE_KEY);
    resetWeb3authSession();
    accountRepository.setConnectedWallet(false);
    setLoadingConnect("initial");
    await disconnect();
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
        connectAdenaClient();

        const adena = AdenaClient.createAdenaClient(defaultGnoswapMemo);
        const data = await adena?.getAccount();
        if (data?.status === "failure" && data.type !== "WALLET_LOCKED") {
          disconnectWallet();
          return;
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  const switchNetwork = async (targetWalletClient?: WalletClient | null) => {
    try {
      setLoadingConnect("loading");
      const adena = targetWalletClient ?? AdenaClient.createAdenaClient(defaultGnoswapMemo);
      if (!adena) {
        setLoadingConnect("error");
        return;
      }

      const res = await adena?.switchNetwork(DEFAULT_CHAIN_ID);

      if (res.code === 0) {
        const accountResponse = await adena.getAccount();
        AdenaError.validate(accountResponse);
        const account = AccountMapper.fromResponse(accountResponse);
        sessionStorage.setItem(ACCOUNT_SESSION_INFO_KEY, JSON.stringify(account));
        sessionStorage.setItem(GNOSWAP_WALLET_TYPE_KEY, "ADENA");
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

    const adena = AdenaClient.createAdenaClient(defaultGnoswapMemo);
    if (adena !== null) {
      sessionStorage.setItem(GNOSWAP_WALLET_TYPE_KEY, "ADENA");
      adena.initAdena();
    } else {
      window.open("https://adena.app/", "", "noopener,noreferrer");
    }
    setWalletClient(adena);
    return adena;
  }, [sessionId, loadingConnect]);

  const connectAccount = async (targetWalletClient?: WalletClient | null) => {
    if (connectingAdenaAccount) {
      return;
    }

    connectingAdenaAccount = true;

    try {
      setLoadingConnect("loading");

      const currentWalletClient = targetWalletClient ?? walletClient;

      if (currentWalletClient === null) {
        const adena = AdenaClient.createAdenaClient(defaultGnoswapMemo);
        setWalletClient(adena);
        setLoadingConnect("initial");
        return;
      }

      const established = await currentWalletClient.addEstablishedSite("Gnoswap");

      if (isWalletLockedResponse(established)) {
        setLoadingConnect("initial");
        return;
      }
      if (established.code === 4000) {
        setLoadingConnect("initial");
        return;
      }

      if (established.code === 0 || established.code === 4001) {
        const accountResponse = await currentWalletClient.getAccount();
        AdenaError.validate(accountResponse);
        const account = AccountMapper.fromResponse(accountResponse);
        const availNetwork = SUPPORT_CHAIN_IDS.includes(account.chainId);
        if (!availNetwork) {
          await switchNetwork(currentWalletClient);
          return;
        }
        sessionStorage.setItem(ACCOUNT_SESSION_INFO_KEY, JSON.stringify(account));
        sessionStorage.setItem(GNOSWAP_WALLET_TYPE_KEY, "ADENA");
        setWalletAccount(account);
        accountRepository.setConnectedWallet(true);
        setLoadingConnect("done");
      } else {
        accountRepository.setConnectedWallet(false);
        setLoadingConnect("error");
      }
    } catch (error) {
      if (isWalletLockedError(error)) {
        setLoadingConnect("initial");
        return;
      }

      setLoadingConnect("error");
      console.error(error);
    } finally {
      connectingAdenaAccount = false;
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

  /**
   * Clears the Web3Auth session unless the adena SDK connection state is "2",
   * or when forced by passing `force=true`.
   *
   * @param force - If true, always clear the session regardless of connection state.
   */
  const resetWeb3authSession = (forceReset: boolean = false) => {
    if (!forceReset) {
      const storedWalletType = sessionStorage.getItem(GNOSWAP_WALLET_TYPE_KEY);
      const storedConnectionState = sessionStorage.getItem(ADENA_SDK_CONNECTION_STATE_KEY);

      const walletType = storedWalletType === "ADENA" || "SOCIAL_WALLET" ? (storedWalletType as WalletType) : null;
      const adenaSDKconnectionState =
        storedConnectionState !== null ? (Number(storedConnectionState) as AdenaSdkConnectionState) : null;
      if (walletType !== "SOCIAL_WALLET" || adenaSDKconnectionState === AdenaSdkConnectionState.CONNECTED) return;
    }

    localStorage.removeItem(AUTH_STORE_KEY);
  };

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
    resetWeb3authSession,
    gnotBalance: balance,
    isLoadingGnotBalance: isLoadingBalance || isBalanceStale,
    refetchGnotBalance: refetch,
  };
};
