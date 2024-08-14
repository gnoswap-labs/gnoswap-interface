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
import { NetworkData } from "@constants/chains.constant";
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
  DEFAULT_CHAIN_ID,
  SUPPORT_CHAIN_IDS,
} from "@constants/environment.constant";
import { NetworkClient } from "@common/clients/network-client";
import { useRouter } from "next/navigation";

interface GnoswapContextProps {
  initialized: boolean;
  rpcProvider: GnoProvider | null;
  gnoswapApiClient: NetworkClient | null;
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
  localStorageClient: WebStorageClient;
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

  const [gnoswapApiClient, setGnoswapApiClient] =
    useState<NetworkClient | null>(null);
  const [routerApiClient, setRouterApiClient] = useState<NetworkClient | null>(
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
    if (!gnoswapApiClient || !routerApiClient || !rpcProvider) {
      return false;
    }
    return true;
  }, [gnoswapApiClient, routerApiClient, rpcProvider]);

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

    const currentChainId = SUPPORT_CHAIN_IDS.includes(
      walletAccount?.chainId || "",
    )
      ? walletAccount?.chainId
      : DEFAULT_CHAIN_ID;
    const network =
      NetworkData.find(info => info.chainId === currentChainId) ||
      NetworkData[0];

    setGnoswapApiClient(
      new AxiosClient(network.apiUrl, () => {
        router.push("/500");
      }),
    );
    setRouterApiClient(new AxiosClient(network.routerUrl));
    setRPCProvider(new GnoJSONRPCProvider(network.rpcUrl || ""));
  }, [loadedProviders, router, status, walletAccount, walletAccount?.chainId]);

  const accountRepository = useMemo(() => {
    return new AccountRepositoryImpl(
      walletClient,
      gnoswapApiClient,
      localStorageClient,
      sessionStorageClient,
      rpcProvider,
    );
  }, [
    walletClient,
    gnoswapApiClient,
    localStorageClient,
    sessionStorageClient,
    rpcProvider,
  ]);

  const liquidityRepository = useMemo(() => {
    return new LiquidityRepositoryMock();
  }, []);

  const poolRepository = useMemo(() => {
    return new PoolRepositoryImpl(gnoswapApiClient, rpcProvider, walletClient);
  }, [gnoswapApiClient, rpcProvider, walletClient]);

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
      routerApiClient,
    );
  }, [rpcProvider, walletClient, routerApiClient]);

  const tokenRepository = useMemo(() => {
    return new TokenRepositoryImpl(gnoswapApiClient, localStorageClient);
  }, [localStorageClient, gnoswapApiClient]);

  const positionRepository = useMemo(() => {
    return new PositionRepositoryImpl(gnoswapApiClient, rpcProvider, walletClient);
  }, [gnoswapApiClient, rpcProvider, walletClient]);

  const dashboardRepository = useMemo(() => {
    return new DashboardRepositoryImpl(gnoswapApiClient, localStorageClient);
  }, [localStorageClient, gnoswapApiClient]);

  const notificationRepository = useMemo(() => {
    return new NotificationRepositoryImpl(gnoswapApiClient, localStorageClient);
  }, [localStorageClient, gnoswapApiClient]);
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
        gnoswapApiClient,
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
        localStorageClient,
      }}
    >
      {loadedProviders && children}
    </GnoswapContext.Provider>
  );
};

export default GnoswapServiceProvider;
