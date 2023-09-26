import { AxiosClient } from "@common/clients/network-client/axios-client";
import { WebStorageClient } from "@common/clients/storage-client";
import { WalletClient } from "@common/clients/wallet-client";
import { AdenaClient } from "@common/clients/wallet-client/adena";
import { AccountRepository, AccountRepositoryImpl } from "@repositories/account";
import { LiquidityRepository, LiquidityRepositoryMock } from "@repositories/liquidity";
import { PoolRepository } from "@repositories/pool";
import { PoolRepositoryImpl } from "@repositories/pool/pool-repository-impl";
import { StakingRepository, StakingRepositoryMock } from "@repositories/staking";
import { SwapRepository, SwapRepositoryMock } from "@repositories/swap";
import { TokenRepository } from "@repositories/token";
import { TokenRepositoryImpl } from "@repositories/token/token-repository-impl";
import { createContext, useMemo, useState } from "react";

interface GnoswapContextProps {
  accountRepository: AccountRepository;
  liquidityRepository: LiquidityRepository;
  poolRepository: PoolRepository;
  stakingRepository: StakingRepository;
  swapRepository: SwapRepository;
  tokenRepository: TokenRepository;
}

const API_URL = "https://mock-api.gnoswap.io/v3/testnet";

export const GnoswapContext = createContext<GnoswapContextProps | null>(null);

const GnoswapServiceProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {

  const [walletClient] = useState<WalletClient>(new AdenaClient());

  const [networkClient] = useState(new AxiosClient(API_URL));

  const [localStorageClient] = useState(WebStorageClient.createLocalStorageClient());

  const accountRepository = useMemo(() => {
    return new AccountRepositoryImpl(walletClient, localStorageClient);
  }, [walletClient, localStorageClient]);

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
