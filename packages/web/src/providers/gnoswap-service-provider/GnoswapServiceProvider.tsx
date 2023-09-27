import { AxiosClient } from "@common/clients/network-client/axios-client";
import { WebStorageClient } from "@common/clients/storage-client";
import { AccountRepository, AccountRepositoryImpl } from "@repositories/account";
import { LiquidityRepository, LiquidityRepositoryMock } from "@repositories/liquidity";
import { PoolRepository } from "@repositories/pool";
import { PoolRepositoryImpl } from "@repositories/pool/pool-repository-impl";
import { StakingRepository, StakingRepositoryMock } from "@repositories/staking";
import { SwapRepository, SwapRepositoryMock } from "@repositories/swap";
import { TokenRepository } from "@repositories/token";
import { TokenRepositoryImpl } from "@repositories/token/token-repository-impl";
import { createContext, useEffect, useMemo, useState } from "react";
import { useAtom } from "jotai";
import { CommonState, WalletState } from "@states/index";
import { Provider, WSProvider } from "@gnolang/tm2-js-client";

interface GnoswapContextProps {
  rpcProvider: Provider | null;
  accountRepository: AccountRepository;
  liquidityRepository: LiquidityRepository;
  poolRepository: PoolRepository;
  stakingRepository: StakingRepository;
  swapRepository: SwapRepository;
  tokenRepository: TokenRepository;
}

const API_URL = "https://dev-api.gnoswap.io/v3/testnet";

export const GnoswapContext = createContext<GnoswapContextProps | null>(null);

const GnoswapServiceProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {

  const [networkClient] = useState(new AxiosClient(API_URL));

  const [localStorageClient] = useState(WebStorageClient.createLocalStorageClient());

  const [sessionStorageClient] = useState(WebStorageClient.createSessionStorageClient());

  const [walletClient] = useAtom(WalletState.client);

  const [network] = useAtom(CommonState.network);

  const [rpcProvider, setRPCProvider] = useState<Provider | null>(null);

  useEffect(() => {
    try {
      const provider = new WSProvider(network.wsUrl, 5 * 1000);
      provider.waitForOpenConnection().then(() => setRPCProvider(provider));
    } catch { }
  }, [network]);

  const accountRepository = useMemo(() => {
    return new AccountRepositoryImpl(walletClient, networkClient, localStorageClient, sessionStorageClient);
  }, [walletClient, networkClient, localStorageClient, sessionStorageClient]);

  const liquidityRepository = useMemo(() => {
    return new LiquidityRepositoryMock();
  }, []);

  const poolRepository = useMemo(() => {
    return new PoolRepositoryImpl(networkClient);
  }, [networkClient]);

  const stakingRepository = useMemo(() => {
    return new StakingRepositoryMock();
  }, []);

  const swapRepository = useMemo(() => {
    return new SwapRepositoryMock();
  }, []);

  const tokenRepository = useMemo(() => {
    return new TokenRepositoryImpl(networkClient, localStorageClient);
  }, [localStorageClient, networkClient]);

  return (
    <GnoswapContext.Provider
      value={{
        rpcProvider,
        accountRepository,
        liquidityRepository,
        poolRepository,
        stakingRepository,
        swapRepository,
        tokenRepository,
      }}
    >
      {children}
    </GnoswapContext.Provider>
  );
};

export default GnoswapServiceProvider;
