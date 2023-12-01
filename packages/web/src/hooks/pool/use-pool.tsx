import { SwapFeeTierType } from "@constants/option.constant";
import { AddLiquidityPriceRage } from "@containers/earn-add-liquidity-container/EarnAddLiquidityContainer";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useWallet } from "@hooks/wallet/use-wallet";
import { PoolModel } from "@models/pool/pool-model";
import { TokenModel } from "@models/token/token-model";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePoolData } from "./use-pool-data";

interface Props {
  tokenA: TokenModel | null;
  tokenB: TokenModel | null;
}

export const usePool = ({
  tokenA,
  tokenB
}: Props) => {
  const { account } = useWallet();
  const { poolRepository } = useGnoswapContext();
  const { pools, updatePools } = usePoolData();
  const [feetierOfLiquidityMap, setFeetierOfLiquidityMap] = useState<{ [key in string]: number }>({});

  const currentPools: PoolModel[] = useMemo(() => {
    if (!tokenA || !tokenB) {
      return [];
    }

    const tokenPairOfPaths = [tokenA.path, tokenB.path]; // [tokenA.path, tokenB.path];
    return pools?.filter(pool => tokenPairOfPaths.includes(pool.tokenA.path) && tokenPairOfPaths.includes(pool.tokenB.path));
  }, [pools, tokenA, tokenB]);

  async function fetchPoolInfos(pools: PoolModel[]) {
    const poolInfos = await (await Promise.all(pools.map(pool => poolRepository.getPoolInfoByPoolPath(pool.id).catch(null)))).filter(info => info !== null);
    return poolInfos;
  }

  const createPool = useCallback(async ({
    tokenAAmount,
    tokenBAmount,
    swapFeeTier,
    startPrice,
    priceRange,
    slippage,
  }: {
    tokenAAmount: string;
    tokenBAmount: string;
    swapFeeTier: SwapFeeTierType;
    startPrice: string;
    priceRange: AddLiquidityPriceRage;
    slippage: number;
  }) => {
    if (!tokenA || !tokenB || !account) {
      return null;
    }
    const hash = await poolRepository.createPool({
      tokenA,
      tokenB,
      tokenAAmount,
      tokenBAmount,
      feeTier: swapFeeTier,
      startPrice,
      minTick: priceRange.range.minTick,
      maxTick: priceRange.range.maxTick,
      slippage,
      caller: account.address
    }).catch(e => {
      console.error(e);
      return null;
    });
    return hash;
  }, [account, poolRepository, tokenA, tokenB]);

  useEffect(() => {
    updatePools();
  }, []);

  useEffect(() => {
    fetchPoolInfos(currentPools)
      .then(infos => {
        const feetierOfLiquidityMap: { [key in string]: number } = {};
        const totalLiquidities = infos.map(info => info.liquidity).reduce((total, cur) => total + cur, 0n);
        for (const info of infos) {
          const liquidityRate = Math.round(Number(info.liquidity / totalLiquidities) * 100);
          const feeTier = currentPools.find(pool => pool.id === info.poolPath)?.fee;
          if (feeTier) {
            feetierOfLiquidityMap[`${feeTier}`] = liquidityRate;
          }
        }
        return feetierOfLiquidityMap;
      })
      .then(setFeetierOfLiquidityMap);
  }, [currentPools]);

  return {
    pools: currentPools,
    feetierOfLiquidityMap,
    createPool
  };
};