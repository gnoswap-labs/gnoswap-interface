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
import { GnoProvider, GnoWSProvider } from "@gnolang/gno-js-client";

interface GnoswapContextProps {
  rpcProvider: GnoProvider | null;
  accountRepository: AccountRepository;
  liquidityRepository: LiquidityRepository;
  poolRepository: PoolRepository;
  stakingRepository: StakingRepository;
  swapRepository: SwapRepository;
  tokenRepository: TokenRepository;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const GnoswapContext = createContext<GnoswapContextProps | null>(null);

const GnoswapServiceProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [networkClient] = useState(new AxiosClient(API_URL));

  const [localStorageClient, setLocalStorageClient] = useState(WebStorageClient.createLocalStorageClient());

  const [sessionStorageClient, setSessionStorageClient] = useState(WebStorageClient.createSessionStorageClient());

  const [walletClient] = useAtom(WalletState.client);

  const [network] = useAtom(CommonState.network);

  const [rpcProvider, setRPCProvider] = useState<GnoProvider | null>(null);

  useEffect(() => {
    if (window) {
      setLocalStorageClient(WebStorageClient.createLocalStorageClient());
      setSessionStorageClient(WebStorageClient.createSessionStorageClient());
    }
  }, []);

  useEffect(() => {
    if (network) {
      const provider = new GnoWSProvider(network.wsUrl, 5 * 1000);
      provider.waitForOpenConnection().then(() => setRPCProvider(provider));
    }
  }, [network]);

  const accountRepository = useMemo(() => {
    return new AccountRepositoryImpl(walletClient, networkClient, localStorageClient, sessionStorageClient);
  }, [walletClient, networkClient, localStorageClient, sessionStorageClient]);

  const liquidityRepository = useMemo(() => {
    return new LiquidityRepositoryMock();
  }, []);

  const poolRepository = useMemo(() => {
    return new PoolRepositoryImpl(networkClient, walletClient);
  }, [networkClient, walletClient]);

  const stakingRepository = useMemo(() => {
    return new StakingRepositoryMock();
  }, []);

  const swapRepository = useMemo(() => {
    return new SwapRepositoryMock(walletClient);
  }, [walletClient]);

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
