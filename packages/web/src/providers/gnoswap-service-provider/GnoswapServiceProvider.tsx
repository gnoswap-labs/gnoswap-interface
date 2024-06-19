"use client";

import { AxiosClient } from "@common/clients/network-client/axios-client";
import { WebStorageClient } from "@common/clients/storage-client";
import {
  AccountRepository,
  AccountRepositoryImpl,
} from "@repositories/account";
import {
  LiquidityRepository,
  LiquidityRepositoryMock,
} from "@repositories/liquidity";
import { PoolRepository } from "@repositories/pool";
import { PoolRepositoryImpl } from "@repositories/pool/pool-repository-impl";
import {
  StakingRepository,
  StakingRepositoryMock,
} from "@repositories/staking";
import { SwapRepository } from "@repositories/swap";
import { TokenRepository } from "@repositories/token";
import { TokenRepositoryImpl } from "@repositories/token/token-repository-impl";
import { createContext, useEffect, useMemo, useState } from "react";
import { useAtom } from "jotai";
import { CommonState, WalletState } from "@states/index";
import { GnoProvider, GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { SwapRepositoryImpl } from "@repositories/swap/swap-repository-impl";
import ChainNetworkInfos from "@resources/chains.json";
import { SwapRouterRepository } from "@repositories/swap/swap-router-repository";
import { SwapRouterRepositoryImpl } from "@repositories/swap/swap-router-repository-impl";
import { PositionRepository } from "@repositories/position/position-repository";
import { PositionRepositoryImpl } from "@repositories/position/position-repository-impl";
import {
  DashboardRepository,
  DashboardRepositoryImpl,
} from "@repositories/dashboard";
import {
  NotificationRepository,
  NotificationRepositoryImpl,
} from "@repositories/notification";
import { WalletRepositoryImpl } from "@repositories/wallet/wallet-repository-impl";
import { WalletRepository } from "@repositories/wallet/wallet-repository";
import {
  ACCOUNT_SESSION_INFO_KEY,
  GNOSWAP_SESSION_ID_KEY,
  GNOWSWAP_CONNECTED_KEY,
} from "@states/common";
import { LeaderboardRepositoryMock } from "@repositories/leaderboard/leaderboard-repository-mock";
import { LeaderboardRepository } from "@repositories/leaderboard/leaderboard-repository";
import {
  API_URL,
  DEFAULT_CHAIN_ID,
  DEV_CHAIN_ID,
  ROUTER_API_URL,
  DEV_API_URL,
  DEV_ROUTER_API_URL,
  CHAINS,
} from "@constants/environment.constant";
import { NetworkClient } from "@common/clients/network-client";
import { useRouter } from "next/navigation";

interface GnoswapContextProps {
  initialized: boolean;
  rpcProvider: GnoProvider | null;
  networkClient: NetworkClient | null;
  accountRepository: AccountRepository;
  liquidityRepository: LiquidityRepository;
  poolRepository: PoolRepository;
  stakingRepository: StakingRepository;
  swapRepository: SwapRepository;
  swapRouterRepository: SwapRouterRepository;
  tokenRepository: TokenRepository;
  positionRepository: PositionRepository;
  dashboardRepository: DashboardRepository;
  notificationRepository: NotificationRepository;
  walletRepository: WalletRepository;
  leaderboardRepository: LeaderboardRepository;
}

const getSessionId = () => {
  const sessionId = sessionStorage.getItem(GNOSWAP_SESSION_ID_KEY);
  if (sessionId) {
    return sessionId;
  }
  return null;
};

const getAccountInfo = () => {
  const accountInfo = sessionStorage.getItem(ACCOUNT_SESSION_INFO_KEY);
  if (accountInfo) {
    return JSON.parse(accountInfo);
  }
  return null;
};

const getStatus = () => {
  const status = sessionStorage.getItem(GNOWSWAP_CONNECTED_KEY);
  if (status) {
    return status;
  }
  return null;
};

export const GnoswapContext = createContext<GnoswapContextProps | null>(null);

const GnoswapServiceProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const router = useRouter();
  const [sessionId, setSessionId] = useAtom(CommonState.sessionId);
  const [walletAccount, setWalletAccount] = useAtom(WalletState.account);
  const [status, setStatus] = useAtom(WalletState.status);

  const [networkClient, setNetworkClient] = useState<NetworkClient | null>(
    null,
  );
  const [routerAPIClient, setRouterAPIClient] = useState<NetworkClient | null>(
    null,
  );

  const [localStorageClient, setLocalStorageClient] = useState(
    WebStorageClient.createLocalStorageClient(),
  );

  const [sessionStorageClient, setSessionStorageClient] = useState(
    WebStorageClient.createSessionStorageClient(),
  );

  const [walletClient] = useAtom(WalletState.client);

  const [rpcProvider, setRPCProvider] = useState<GnoProvider | null>(null);

  const initialized = useMemo(() => {
    return rpcProvider !== null && window !== undefined;
  }, [rpcProvider]);

  const loadedProviders = useMemo(() => {
    if (!networkClient || !routerAPIClient || !rpcProvider) {
      return false;
    }
    return true;
  }, [networkClient, routerAPIClient, rpcProvider]);

  useEffect(() => {
    const sessionId = getSessionId();
    const accountInfo = getAccountInfo();
    const status = getStatus();
    setSessionId(sessionId || "");
    setWalletAccount(accountInfo);
    setStatus(status || "init");
  }, []);

  useEffect(() => {
    if (window) {
      setLocalStorageClient(WebStorageClient.createLocalStorageClient());
      setSessionStorageClient(WebStorageClient.createSessionStorageClient());
    }
  }, [sessionId]);

  useEffect(() => {
    if (!status) {
      return;
    }

    if (status === "connected" && !walletAccount && !loadedProviders) {
      return;
    }

    const currentChainId = CHAINS.includes(walletAccount?.chainId || "")
      ? walletAccount?.chainId
      : DEFAULT_CHAIN_ID;
    const network =
      ChainNetworkInfos.find(info => info.chainId === currentChainId) ||
      ChainNetworkInfos[0];

    switch (currentChainId) {
      case DEV_CHAIN_ID:
        setNetworkClient(new AxiosClient(DEV_API_URL, () => {
          router.push("/500");
        }));
        setRouterAPIClient(new AxiosClient(DEV_ROUTER_API_URL));
        setRPCProvider(new GnoJSONRPCProvider(network.rpcUrl || ""));
        break;
      case DEFAULT_CHAIN_ID:
      default:
        setNetworkClient(new AxiosClient(API_URL, () => {
          router.push("/500");
        }));
        setRouterAPIClient(new AxiosClient(ROUTER_API_URL));
        setRPCProvider(new GnoJSONRPCProvider(network.rpcUrl));
        break;
    }
  }, [loadedProviders, router, status, walletAccount, walletAccount?.chainId]);

  const accountRepository = useMemo(() => {
    return new AccountRepositoryImpl(
      walletClient,
      networkClient,
      localStorageClient,
      sessionStorageClient,
      rpcProvider,
    );
  }, [
    walletClient,
    networkClient,
    localStorageClient,
    sessionStorageClient,
    rpcProvider,
  ]);

  const liquidityRepository = useMemo(() => {
    return new LiquidityRepositoryMock();
  }, []);

  const poolRepository = useMemo(() => {
    return new PoolRepositoryImpl(networkClient, rpcProvider, walletClient);
  }, [networkClient, rpcProvider, walletClient]);

  const stakingRepository = useMemo(() => {
    return new StakingRepositoryMock();
  }, []);

  const swapRepository = useMemo(() => {
    return new SwapRepositoryImpl(
      walletClient,
      rpcProvider,
      localStorageClient,
    );
  }, [localStorageClient, rpcProvider, walletClient]);

  const swapRouterRepository = useMemo(() => {
    return new SwapRouterRepositoryImpl(
      rpcProvider,
      walletClient,
      routerAPIClient,
    );
  }, [rpcProvider, walletClient, routerAPIClient]);

  const tokenRepository = useMemo(() => {
    return new TokenRepositoryImpl(networkClient, localStorageClient);
  }, [localStorageClient, networkClient]);

  const positionRepository = useMemo(() => {
    return new PositionRepositoryImpl(networkClient, rpcProvider, walletClient);
  }, [networkClient, rpcProvider, walletClient]);

  const dashboardRepository = useMemo(() => {
    return new DashboardRepositoryImpl(networkClient, localStorageClient);
  }, [localStorageClient, networkClient]);

  const notificationRepository = useMemo(() => {
    return new NotificationRepositoryImpl(networkClient, localStorageClient);
  }, [localStorageClient, networkClient]);
  const walletRepository = useMemo(() => {
    return new WalletRepositoryImpl(walletClient);
  }, [walletClient]);

  const leaderboardRepository = useMemo(() => {
    return new LeaderboardRepositoryMock();
  }, []);

  useEffect(() => {
    if (window) {
      setLocalStorageClient(WebStorageClient.createLocalStorageClient());
      setSessionStorageClient(WebStorageClient.createSessionStorageClient());
    }
  }, []);

  return (
    <GnoswapContext.Provider
      value={{
        initialized,
        rpcProvider,
        networkClient,
        accountRepository,
        liquidityRepository,
        poolRepository,
        stakingRepository,
        swapRepository,
        tokenRepository,
        swapRouterRepository,
        positionRepository,
        dashboardRepository,
        notificationRepository,
        walletRepository,
        leaderboardRepository,
      }}
    >
      {loadedProviders && children}
    </GnoswapContext.Provider>
  );
};

export default GnoswapServiceProvider;
