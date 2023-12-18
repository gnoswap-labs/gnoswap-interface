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
import {
  createContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { useAtom } from "jotai";
import { CommonState, WalletState } from "@states/index";
import { GnoJSONRPCProvider, GnoProvider } from "@gnolang/gno-js-client";
import { SwapRepositoryImpl } from "@repositories/swap/swap-repository-impl";
import ChainNetworkInfos from "@resources/chains.json";
import { SwapRouterRepository } from "@repositories/swap/swap-router-repository";
import { SwapRouterRepositoryImpl } from "@repositories/swap/swap-router-repository-impl";
import { DEFAULT_NETWORK_ID } from "@constants/common.constant";
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

interface GnoswapContextProps {
  initialized: boolean;
  rpcProvider: GnoProvider | null;
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
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const GnoswapContext = createContext<GnoswapContextProps | null>(null);

const GnoswapServiceProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [networkClient] = useState(new AxiosClient(API_URL));

  const [localStorageClient, setLocalStorageClient] = useState(
    WebStorageClient.createLocalStorageClient(),
  );

  const [sessionStorageClient, setSessionStorageClient] = useState(
    WebStorageClient.createSessionStorageClient(),
  );

  const [walletClient] = useAtom(WalletState.client);

  const [network] = useAtom(CommonState.network);

  const [rpcProvider, setRPCProvider] = useState<GnoProvider | null>(null);

  const initialized = useMemo(() => {
    return rpcProvider !== null && window !== undefined;
  }, [rpcProvider]);

  useEffect(() => {
    if (window) {
      setLocalStorageClient(WebStorageClient.createLocalStorageClient());
      setSessionStorageClient(WebStorageClient.createSessionStorageClient());
    }
  }, []);

  useEffect(() => {
    const defaultChainId = process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID || "";
    const currentNetwork =
      network ||
      ChainNetworkInfos.find(info => info.chainId === defaultChainId);
    if (currentNetwork) {
      const provider = new GnoJSONRPCProvider(currentNetwork.rpcUrl);
      setRPCProvider(provider);
    }
  }, [network]);

  const accountRepository = useMemo(() => {
    return new AccountRepositoryImpl(
      walletClient,
      networkClient,
      localStorageClient,
      sessionStorageClient,
    );
  }, [walletClient, networkClient, localStorageClient, sessionStorageClient]);

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
    return new SwapRouterRepositoryImpl(rpcProvider, walletClient);
  }, [rpcProvider, walletClient]);

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

  async function initNetwork() {
    const defaultChainId =
      process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID || DEFAULT_NETWORK_ID;
    const currentNetwork =
      network ||
      ChainNetworkInfos.find(info => info.chainId === defaultChainId);
    if (currentNetwork) {
      try {
        const provider = new GnoJSONRPCProvider(currentNetwork.rpcUrl);
        setRPCProvider(provider);
        return true;
      } catch (error) {
        console.log(error);
      }
    }
    setRPCProvider(null);
    return false;
  }

  useLayoutEffect(() => {
    if (window) {
      setLocalStorageClient(WebStorageClient.createLocalStorageClient());
      setSessionStorageClient(WebStorageClient.createSessionStorageClient());
    }
  }, []);

  useLayoutEffect(() => {
    initNetwork();
  }, [network]);

  return (
    <GnoswapContext.Provider
      value={{
        initialized,
        rpcProvider,
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
      }}
    >
      {rpcProvider && children}
    </GnoswapContext.Provider>
  );
};

export default GnoswapServiceProvider;
