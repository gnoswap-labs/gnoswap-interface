import {
  SwapFeeTierInfoMap,
  SwapFeeTierType,
} from "@constants/option.constant";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useWallet } from "@hooks/wallet/use-wallet";
import { PoolModel } from "@models/pool/pool-model";
import { isNativeToken, TokenModel } from "@models/token/token-model";
import { useCallback, useEffect, useMemo } from "react";
import { usePoolData } from "./use-pool-data";
import { checkGnotPath } from "@utils/common";
import { useGetPoolCreationFee, useGetRPCPoolsBy } from "@query/pools";

interface Props {
  compareToken: TokenModel | null;
  tokenA: TokenModel | null;
  tokenB: TokenModel | null;
  isReverted?: boolean;
}

export const usePool = ({
  compareToken,
  tokenA,
  tokenB,
  isReverted = false,
}: Props) => {
  const { account } = useWallet();
  const { poolRepository } = useGnoswapContext();
  const { pools, updatePools, isFetchedPools, loading } = usePoolData();
  const { data: createPoolFee } = useGetPoolCreationFee();

  const allPoolPaths = useMemo(() => {
    if (!tokenA || !tokenB) {
      return [];
    }
    const tokenATokenPath = checkGnotPath(tokenA.path)
      ? tokenA.wrappedPath
      : tokenA.path;
    const tokenBTokenPath = checkGnotPath(tokenB.path)
      ? tokenB.wrappedPath
      : tokenB.path;

    const tokenPair = [tokenATokenPath, tokenBTokenPath].sort();

    return [
      SwapFeeTierInfoMap.FEE_100,
      SwapFeeTierInfoMap.FEE_500,
      SwapFeeTierInfoMap.FEE_3000,
      SwapFeeTierInfoMap.FEE_10000,
    ].map(feeInfo => `${tokenPair[0]}:${tokenPair[1]}:${feeInfo.fee}`);
  }, [tokenA, tokenB]);

  const {
    data: rpcPools,
    isLoading: isLoadingRPCPools,
    refetch: refetchRPCPools,
  } = useGetRPCPoolsBy(allPoolPaths);
  console.log("🚀 ~ rpcPools:", rpcPools);

  const feetierOfLiquidityMap: { [key in string]: number } | null =
    useMemo(() => {
      if (!rpcPools) {
        return null;
      }
      const feetierOfLiquidityMap: { [key in string]: number } = {};

      const totalLiquidities = rpcPools
        .map(info => info.liquidity)
        .reduce((total, cur) => total + cur, 0n);
      for (const info of rpcPools) {
        const liquidityRate =
          totalLiquidities === 0n
            ? 0
            : (Number(info.liquidity) * 100) / Number(totalLiquidities);
        const feeTier = info.fee;
        if (feeTier) {
          feetierOfLiquidityMap[`${feeTier}`] = liquidityRate;
        }
      }
      return feetierOfLiquidityMap;
    }, [rpcPools]);

  const currentPools: PoolModel[] = useMemo(() => {
    if (!tokenA || !tokenB) {
      return [];
    }

    const tokenATokenPath = checkGnotPath(tokenA.path)
      ? tokenA.wrappedPath
      : tokenA.path;
    const tokenBTokenPath = checkGnotPath(tokenB.path)
      ? tokenB.wrappedPath
      : tokenB.path;

    const tokenPairOfPaths = [tokenATokenPath, tokenBTokenPath];
    return pools?.filter(pool => {
      const currentTokenATokenPath = isNativeToken(pool.tokenA)
        ? pool.tokenA.wrappedPath
        : pool.tokenA.path;
      const currentTokenBTokenPath = isNativeToken(pool.tokenB)
        ? pool.tokenB.wrappedPath
        : pool.tokenB.path;
      return (
        tokenPairOfPaths.includes(currentTokenATokenPath) &&
        tokenPairOfPaths.includes(currentTokenBTokenPath)
      );
    });
  }, [pools, tokenA, tokenB]);

  const getCurrentTokenPairAmount = useCallback(
    (tokenAAmount: string, tokenBAmount: string) => {
      if (!compareToken || !tokenA || !tokenB) {
        return null;
      }
      const ordered = compareToken.path === tokenA.path;
      if (ordered) {
        return {
          tokenA,
          tokenAAmount,
          tokenB,
          tokenBAmount,
        };
      }
      return {
        tokenA: tokenB,
        tokenAAmount: tokenBAmount,
        tokenB: tokenA,
        tokenBAmount: tokenAAmount,
      };
    },
    [compareToken, tokenA, tokenB],
  );

  const createPool = useCallback(
    async ({
      tokenAAmount,
      tokenBAmount,
      swapFeeTier,
      startPrice,
      minTick,
      maxTick,
      slippage,
      withStaking,
    }: {
      tokenAAmount: string;
      tokenBAmount: string;
      swapFeeTier: SwapFeeTierType;
      startPrice: string;
      minTick: number;
      maxTick: number;
      slippage: string;
      withStaking?: boolean;
    }) => {
      if (!tokenA || !tokenB || !account || createPoolFee === undefined) {
        return null;
      }
      const currentTokenData = getCurrentTokenPairAmount(
        tokenAAmount,
        tokenBAmount,
      );
      if (!currentTokenData) {
        return null;
      }
      return poolRepository
        .createPool({
          tokenA: currentTokenData.tokenA,
          tokenB: currentTokenData.tokenB,
          tokenAAmount: currentTokenData.tokenAAmount,
          tokenBAmount: currentTokenData.tokenBAmount,
          feeTier: swapFeeTier,
          startPrice,
          minTick,
          maxTick,
          slippage,
          caller: account.address,
          withStaking,
          createPoolFee,
        })
        .catch(e => {
          console.error(e);
          return null;
        });
    },
    [account, poolRepository, tokenA, tokenB, compareToken, createPoolFee],
  );

  const addLiquidity = useCallback(
    async ({
      tokenAAmount,
      tokenBAmount,
      swapFeeTier,
      minTick,
      maxTick,
      slippage,
      withStaking,
    }: {
      tokenAAmount: string;
      tokenBAmount: string;
      swapFeeTier: SwapFeeTierType;
      minTick: number;
      maxTick: number;
      slippage: string;
      withStaking?: boolean;
    }) => {
      if (!tokenA || !tokenB || !account) {
        return null;
      }
      const currentTokenData = getCurrentTokenPairAmount(
        tokenAAmount,
        tokenBAmount,
      );
      if (!currentTokenData) {
        return null;
      }
      return poolRepository
        .addLiquidity({
          tokenA: currentTokenData.tokenA,
          tokenB: currentTokenData.tokenB,
          tokenAAmount: currentTokenData.tokenAAmount,
          tokenBAmount: currentTokenData.tokenBAmount,
          feeTier: swapFeeTier,
          minTick,
          maxTick,
          slippage: Number(slippage),
          caller: account.address,
          withStaking,
        })
        .catch(e => {
          console.error(e);
          return null;
        });
    },
    [tokenA, tokenB, account, getCurrentTokenPairAmount, poolRepository],
  );

  useEffect(() => {
    updatePools();
  }, []);

  useEffect(() => {
    if (!tokenA || !tokenB || isReverted) {
      return;
    }
    refetchRPCPools();
  }, [tokenA, tokenB, isReverted]);

  return {
    fetching: isLoadingRPCPools,
    pools: currentPools,
    feetierOfLiquidityMap: feetierOfLiquidityMap || {},
    createPool,
    addLiquidity,
    isFetchedPools,
    isFetchingPools: loading,
  };
};
