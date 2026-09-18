import axios from "axios";
import { useAtom } from "jotai";
import { createContext, useCallback, useEffect, useMemo, useState } from "react";

import { NetworkClient } from "@common/clients/network-client";
import { AxiosClient } from "@common/clients/network-client/axios-client";
import { WebStorageClient } from "@common/clients/storage-client";
import { EventStore, TransactionEventStore } from "@common/modules/event-store";
import { NetworkData } from "@constants/chains.constant";
import { DEFAULT_CHAIN_ID, SUPPORT_CHAIN_IDS } from "@constants/environment.constant";
import { GnoProvider } from "@common/clients/gno-provider/gno-provider";
import { AccountRepository, AccountRepositoryImpl } from "@repositories/account";
import { DashboardRepository, DashboardRepositoryImpl } from "@repositories/dashboard";
import { GovernanceRepository, GovernanceRepositoryImpl } from "@repositories/governance";
import { LaunchpadRepository, LaunchpadRepositoryImpl } from "@repositories/launchpad";
import { LeaderboardRepository, LeaderboardRepositoryImpl } from "@repositories/leaderboard";
import { NotificationRepository, NotificationRepositoryImpl } from "@repositories/notification";
import { PoolRepository, PoolRepositoryImpl } from "@repositories/pool";
import { PositionRepository, PositionRepositoryImpl } from "@repositories/position";
import { StatusRepository, StatusRepositoryImpl } from "@repositories/status";
import { SwapRouterRepository, SwapRouterRepositoryImpl } from "@repositories/swap-router";
import { TokenRepository, TokenRepositoryImpl } from "@repositories/token";
import { WalletRepository, WalletRepositoryImpl } from "@repositories/wallet";
import { ACCOUNT_SESSION_INFO_KEY, GNOSWAP_SESSION_ID_KEY, GNOWSWAP_CONNECTED_KEY } from "@states/common";
import { CommonState, WalletState } from "@states/index";
import { SwapRepository } from "@repositories/swap/swap-repository";
import { SwapRepositoryImpl } from "@repositories/swap/swap-repository-impl";
import { TransactionService, TransactionServiceImpl } from "@services/transaction";
import { TransactionGasService, TransactionGasServiceImpl } from "@services/transaction-gas";
import { FaucetService, FaucetServiceImpl } from "@services/faucet";
import { FaucetRepositoryImpl } from "@repositories/faucet";
import RpcConnectionFailed from "./RpcConnectionFailed";

interface GnoswapContextProps {
  initialized: boolean;
  rpcProvider: GnoProvider | null;
  eventStore: EventStore<string[]>;
  gnoswapApiClient: NetworkClient | null;
  accountRepository: AccountRepository;
  poolRepository: PoolRepository;
  swapRepository: SwapRepository;
  swapRouterRepository: SwapRouterRepository;
  tokenRepository: TokenRepository;
  positionRepository: PositionRepository;
  dashboardRepository: DashboardRepository;
  notificationRepository: NotificationRepository;
  walletRepository: WalletRepository;
  governanceRepository: GovernanceRepository;
  leaderboardRepository: LeaderboardRepository;
  statusRepository: StatusRepository;
  launchpadRepository: LaunchpadRepository;
  localStorageClient: WebStorageClient;
  transactionService: TransactionService;
  transactionGasService: TransactionGasService;
  faucetService: FaucetService;
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

/** The set of clients that belong to one chain and are swapped as a unit. */
interface ChainClients {
  chainId: string;
  gnoswapApiClient: NetworkClient;
  routerApiClient: NetworkClient;
  rpcProvider: GnoProvider;
}

export const GnoswapContext = createContext<GnoswapContextProps | null>(null);

const GnoswapServiceProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [sessionId, setSessionId] = useAtom(CommonState.sessionId);
  const [walletAccount, setWalletAccount] = useAtom(WalletState.account);
  const [status, setStatus] = useAtom(WalletState.status);

  const [localStorageClient, setLocalStorageClient] = useState(WebStorageClient.createLocalStorageClient());

  const [sessionStorageClient, setSessionStorageClient] = useState(WebStorageClient.createSessionStorageClient());

  const [walletClient] = useAtom(WalletState.client);

  // The API clients and the RPC provider are published together so that a chain
  // switch can never pair one chain's API with another chain's RPC node: the
  // previous, consistent set stays in place until the new one is fully built.
  const [chainClients, setChainClients] = useState<ChainClients | null>(null);
  const [connectionFailed, setConnectionFailed] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const gnoswapApiClient = chainClients?.gnoswapApiClient ?? null;
  const routerApiClient = chainClients?.routerApiClient ?? null;
  const rpcProvider = chainClients?.rpcProvider ?? null;

  // The chain the wallet is asking for, which is not necessarily the one the
  // published clients belong to while a switch is in flight.
  const network = useMemo(() => {
    const currentChainId = SUPPORT_CHAIN_IDS.includes(walletAccount?.chainId || "")
      ? walletAccount?.chainId
      : DEFAULT_CHAIN_ID;

    return NetworkData.find(info => info.chainId === currentChainId) || NetworkData[0];
  }, [walletAccount?.chainId]);

  const initialized = useMemo(() => {
    return rpcProvider !== null && window !== undefined;
  }, [rpcProvider]);

  // Only the bundle that belongs to the requested chain may render children.
  // Everything else in the tree (eventStore, walletAccount) moves to the new
  // chain as soon as the wallet does, so rendering an older bundle would pair
  // clients from two different chains.
  const loadedProviders = chainClients?.chainId === network.chainId;

  const retryConnection = useCallback(() => {
    setConnectionFailed(false);
    setRetryCount(count => count + 1);
  }, []);

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

    // Connecting is a network round trip now, so a re-run of this effect that
    // does not change the chain must not open a second connection.
    if (chainClients?.chainId === network.chainId) {
      return;
    }

    // Creating a provider requires a round trip to the node since gno-js-client v3,
    // so ignore the result once the effect has been superseded.
    let stale = false;

    // A pending attempt must not show the failure screen left over from an
    // earlier one; children are hidden while this runs either way.
    setConnectionFailed(false);

    GnoProvider.create(network.rpcUrl || "")
      .then(rpcProvider => {
        if (stale) {
          return;
        }
        setChainClients({
          chainId: network.chainId,
          gnoswapApiClient: new AxiosClient(network.apiUrl),
          routerApiClient: new AxiosClient(network.routerUrl),
          rpcProvider,
        });
      })
      .catch(error => {
        console.error("Failed to connect to the RPC provider", error);
        if (!stale) {
          setConnectionFailed(true);
        }
      });

    return () => {
      stale = true;
    };
  }, [chainClients?.chainId, loadedProviders, network, retryCount, status, walletAccount]);

  const eventStore = useMemo(() => {
    const axiosClient = axios.create({ baseURL: network.rpcUrl });
    return new TransactionEventStore(axiosClient);
  }, [network]);

  const accountRepository = useMemo(() => {
    return new AccountRepositoryImpl(
      walletClient,
      gnoswapApiClient,
      localStorageClient,
      sessionStorageClient,
      rpcProvider,
    );
  }, [walletClient, gnoswapApiClient, localStorageClient, sessionStorageClient, rpcProvider]);

  const poolRepository = useMemo(() => {
    return new PoolRepositoryImpl(gnoswapApiClient, rpcProvider, walletClient);
  }, [gnoswapApiClient, rpcProvider, walletClient]);

  const swapRepository = useMemo(() => {
    return new SwapRepositoryImpl(gnoswapApiClient, walletClient);
  }, [gnoswapApiClient, walletClient]);

  const swapRouterRepository = useMemo(() => {
    return new SwapRouterRepositoryImpl(rpcProvider, walletClient, routerApiClient);
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

  const governanceRepository = useMemo(() => {
    return new GovernanceRepositoryImpl(gnoswapApiClient, walletClient, rpcProvider);
  }, [gnoswapApiClient, walletClient, rpcProvider]);

  const leaderboardRepository = useMemo(() => {
    return new LeaderboardRepositoryImpl(gnoswapApiClient);
  }, [gnoswapApiClient]);

  const statusRepository = useMemo(() => {
    return new StatusRepositoryImpl(gnoswapApiClient);
  }, [gnoswapApiClient]);

  const launchpadRepository = useMemo(() => {
    return new LaunchpadRepositoryImpl(gnoswapApiClient, walletClient, rpcProvider);
  }, [gnoswapApiClient, walletClient, rpcProvider]);

  const transactionService = useMemo(() => {
    return new TransactionServiceImpl(rpcProvider, walletClient);
  }, [rpcProvider, walletClient]);

  const transactionGasService = useMemo(() => {
    return new TransactionGasServiceImpl(rpcProvider, walletClient);
  }, [rpcProvider, walletClient]);

  const axiosInstance = axios.create({ timeout: 20_000 });

  const faucetRepository = useMemo(() => {
    return new FaucetRepositoryImpl(axiosInstance);
  }, [axiosInstance]);

  const faucetService = useMemo(() => {
    return new FaucetServiceImpl(faucetRepository);
  }, [faucetRepository]);

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
        eventStore,
        gnoswapApiClient,
        accountRepository,
        poolRepository,
        tokenRepository,
        swapRepository,
        swapRouterRepository,
        positionRepository,
        dashboardRepository,
        notificationRepository,
        walletRepository,
        governanceRepository,
        leaderboardRepository,
        statusRepository,
        launchpadRepository,
        localStorageClient,
        transactionService,
        transactionGasService,
        faucetService,
      }}
    >
      {loadedProviders ? children : connectionFailed ? <RpcConnectionFailed onRetry={retryConnection} /> : null}
    </GnoswapContext.Provider>
  );
};

export default GnoswapServiceProvider;
