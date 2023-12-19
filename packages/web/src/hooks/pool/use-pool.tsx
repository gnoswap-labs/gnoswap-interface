import { SwapFeeTierType } from "@constants/option.constant";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useWallet } from "@hooks/wallet/use-wallet";
import { PoolModel } from "@models/pool/pool-model";
import { isNativeToken, TokenModel } from "@models/token/token-model";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePoolData } from "./use-pool-data";

interface Props {
  compareToken: TokenModel | null;
  tokenA: TokenModel | null;
  tokenB: TokenModel | null;
}

export const usePool = ({
  compareToken,
  tokenA,
  tokenB
}: Props) => {
  const { account } = useWallet();
  const { poolRepository } = useGnoswapContext();
  const [fetching, setFetching] = useState(false);
  const { pools, updatePools } = usePoolData();
  const [feetierOfLiquidityMap, setFeetierOfLiquidityMap] = useState<{ [key in string]: number } | null>(null);

  const currentPools: PoolModel[] = useMemo(() => {
    if (!tokenA || !tokenB) {
      return [];
    }

    const tokenATokenPath = isNativeToken(tokenA) ? tokenA.wrappedPath : tokenA.path;
    const tokenBTokenPath = isNativeToken(tokenB) ? tokenB.wrappedPath : tokenB.path;
    const tokenPairOfPaths = [tokenATokenPath, tokenBTokenPath];
    return pools?.filter(pool => {
      const currentTokenATokenPath = isNativeToken(pool.tokenA) ? pool.tokenA.wrappedPath : pool.tokenA.path;
      const currentTokenBTokenPath = isNativeToken(pool.tokenB) ? pool.tokenB.wrappedPath : pool.tokenB.path;
      return tokenPairOfPaths.includes(currentTokenATokenPath) && tokenPairOfPaths.includes(currentTokenBTokenPath);
    });
  }, [pools, tokenA, tokenB]);

  const getCurrentTokenPairAmount = useCallback((tokenAAmount: string, tokenBAmount: string) => {
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
  }, [compareToken, tokenA, tokenB]);

  async function fetchPoolInfos(pools: PoolModel[]) {
    const poolInfos = await (await Promise.all(pools.map(pool => poolRepository.getPoolDetailRPCByPoolPath(pool.path).catch(null)))).filter(info => info !== null);
    return poolInfos;
  }

  const createPool = useCallback(async ({
    tokenAAmount,
    tokenBAmount,
    swapFeeTier,
    startPrice,
    minTick,
    maxTick,
    slippage,
  }: {
    tokenAAmount: string;
    tokenBAmount: string;
    swapFeeTier: SwapFeeTierType;
    startPrice: string;
    minTick: number;
    maxTick: number;
    slippage: string;
  }) => {
    if (!tokenA || !tokenB || !account) {
      return null;
    }
    const currentTokenData = getCurrentTokenPairAmount(tokenAAmount, tokenBAmount);
    if (!currentTokenData) {
      return null;
    }
    const hash = await poolRepository.createPool({
      tokenA: currentTokenData.tokenA,
      tokenB: currentTokenData.tokenB,
      tokenAAmount: currentTokenData.tokenAAmount,
      tokenBAmount: currentTokenData.tokenBAmount,
      feeTier: swapFeeTier,
      startPrice,
      minTick,
      maxTick,
      slippage,
      caller: account.address
    }).catch(e => {
      console.error(e);
      return null;
    });
    return hash;
  }, [account, poolRepository, tokenA, tokenB, compareToken]);

  const addLiquidity = useCallback(async ({
    tokenAAmount,
    tokenBAmount,
    swapFeeTier,
    minTick,
    maxTick,
    slippage,
  }: {
    tokenAAmount: string;
    tokenBAmount: string;
    swapFeeTier: SwapFeeTierType;
    minTick: number;
    maxTick: number;
    slippage: string;
  }) => {
    if (!tokenA || !tokenB || !account) {
      return null;
    }
    const currentTokenData = getCurrentTokenPairAmount(tokenAAmount, tokenBAmount);
    if (!currentTokenData) {
      return null;
    }
    const hash = await poolRepository.addLiquidity({
      tokenA: currentTokenData.tokenA,
      tokenB: currentTokenData.tokenB,
      tokenAAmount: currentTokenData.tokenAAmount,
      tokenBAmount: currentTokenData.tokenBAmount,
      feeTier: swapFeeTier,
      minTick,
      maxTick,
      slippage: Number(slippage),
      caller: account.address
    }).catch(e => {
      console.error(e);
      return null;
    });
    return hash;
  }, [tokenA, tokenB, account, getCurrentTokenPairAmount, poolRepository]);

  useEffect(() => {
    updatePools();
  }, []);

  useEffect(() => {
    setFetching(false);
    setFeetierOfLiquidityMap(null);
    if (!tokenA || !tokenB) {
      return;
    }
    fetchPoolInfos(currentPools)
      .then(infos => {
        const feetierOfLiquidityMap: { [key in string]: number } = {};
        const totalLiquidities = infos.map(info => info.liquidity).reduce((total, cur) => total + cur, 0n);
        for (const info of infos) {
          const liquidityRate = Number(info.liquidity) * 100 / Number(totalLiquidities);
          const feeTier = currentPools.find(pool => pool.path === info.poolPath)?.fee;
          if (feeTier) {
            feetierOfLiquidityMap[`${feeTier}`] = liquidityRate;
          }
        }
        return feetierOfLiquidityMap;
      })
      .then(setFeetierOfLiquidityMap);
  }, [currentPools]);

  useEffect(() => {
    if (feetierOfLiquidityMap) {
      setFetching(true);
    }
  }, [feetierOfLiquidityMap]);

  return {
    fetching,
    pools: currentPools,
    feetierOfLiquidityMap: feetierOfLiquidityMap || {},
    createPool,
    addLiquidity,
  };
};