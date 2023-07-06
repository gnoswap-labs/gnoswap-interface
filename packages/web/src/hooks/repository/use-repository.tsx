import { AccountRepositoryMock } from "@repositories/account";
import { LiquidityRepositoryMock } from "@repositories/liquidity";
import { PoolRepositoryMock } from "@repositories/pool";
import { StakingRepositoryMock } from "@repositories/staking";
import { SwapRepositoryMock } from "@repositories/swap";
import { TokenRepositoryMock } from "@repositories/token";
import { RepositoryState } from "@states/index";
import { useAtom } from "jotai";
import { useNetworkClient } from "./use-network-client";
import { useStorageClient } from "./use-storage-client";
import { useWalletClient } from "./use-wallet-client";

export const useRepository = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const networkClient = useNetworkClient();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const walletClient = useWalletClient();
  const storageClient = useStorageClient();

  const [accountRepository, setAccountRepository] = useAtom(RepositoryState.accountRepository);
  const [liquidityRepository, setLiquidityRepository] = useAtom(RepositoryState.liquidityRepository);
  const [poolRepository, setPoolRepository] = useAtom(RepositoryState.poolRepository);
  const [stakingRepository, setStakingRepository] = useAtom(RepositoryState.stakingRepository);
  const [swapRepository, setSwapRepository] = useAtom(RepositoryState.swapRepository);
  const [tokenRepository, setTokenRepository] = useAtom(RepositoryState.tokenRepository);

  function getAccountRepository() {
    if (!accountRepository) {
      const instance = new AccountRepositoryMock(storageClient);
      setAccountRepository(instance);
      return instance;
    }
    return accountRepository;
  }

  function getLiquidityRepository() {
    if (!liquidityRepository) {
      const instance = new LiquidityRepositoryMock();
      setLiquidityRepository(instance);
      return instance;
    }
    return liquidityRepository;
  }

  function getPoolRepository() {
    if (!poolRepository) {
      const instance = new PoolRepositoryMock();
      setPoolRepository(instance);
      return instance;
    }
    return poolRepository;
  }

  function getStakingRepository() {
    if (!stakingRepository) {
      const instance = new StakingRepositoryMock();
      setStakingRepository(instance);
      return instance;
    }
    return stakingRepository;
  }

  function getSwapRepository() {
    if (!swapRepository) {
      const instance = new SwapRepositoryMock();
      setSwapRepository(instance);
      return instance;
    }
    return swapRepository;
  }

  function getTokenRepository() {
    if (!tokenRepository) {
      const instance = new TokenRepositoryMock(storageClient);
      setTokenRepository(instance);
      return instance;
    }
    return tokenRepository;
  }


  return {
    accountRepository: getAccountRepository(),
    liquidityRepository: getLiquidityRepository(),
    poolRepository: getPoolRepository(),
    stakingRepository: getStakingRepository(),
    swapRepository: getSwapRepository(),
    tokenRepository: getTokenRepository(),
  };
};
