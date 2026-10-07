import { useMemo } from "react";

import { useGnotToGnot } from "@hooks/token/data/use-gnot-wugnot";
import { CardListPoolInfo } from "@models/common/card-list-item-info";
import { PoolModel } from "@models/pool/pool-model";
import { PoolListInfo } from "@models/pool/info/pool-list-info";
import { PoolMapper } from "@models/pool/mapper/pool-mapper";
import { useGetPoolList } from "@query/pools";
const EMPTY_POOLS: PoolModel[] = [];

export const usePoolData = () => {
  const {
    data: poolData,
    isLoading: loading,
    isFetched: isFetchedQuery,
    isError,
    refetch: refetchPools,
  } = useGetPoolList();
  const pools = poolData ?? EMPTY_POOLS;

  const { gnot, wugnotPath, getGnotPath } = useGnotToGnot();

  const poolListInfos = useMemo(() => {
    const temp = pools?.map(PoolMapper.toListInfo);
    return temp.map((item: PoolListInfo) => {
      return {
        ...item,
        tokenA: item.tokenA
          ? {
              ...item.tokenA,
              symbol: getGnotPath(item.tokenA).symbol,
              displaySymbol: getGnotPath(item.tokenA).displaySymbol,
              logoURI: getGnotPath(item.tokenA).logoURI,
              name: getGnotPath(item.tokenA).name,
            }
          : item.tokenA,
        tokenB: item.tokenB
          ? {
              ...item.tokenB,
              symbol: getGnotPath(item.tokenB).symbol,
              displaySymbol: getGnotPath(item.tokenB).displaySymbol,
              logoURI: getGnotPath(item.tokenB).logoURI,
              name: getGnotPath(item.tokenB).name,
            }
          : item.tokenB,
      };
    });
  }, [pools, wugnotPath, gnot]);

  const higestAPRs: CardListPoolInfo[] = useMemo(() => {
    const sortedTokens = pools
      .filter(item => Number(item.tvl) > 0.01)
      .sort((p1, p2) => {
        const p2Apr = p2.apr || 0;
        const p1Apr = p1.apr || 0;
        return Number(p2Apr) - Number(p1Apr);
      })
      .filter((_, index) => index < 3);
    return sortedTokens?.map(pool => ({
      pool: {
        ...pool,
        tokenA: {
          ...pool.tokenA,
          symbol: getGnotPath(pool.tokenA).symbol,
          displaySymbol: getGnotPath(pool.tokenA).displaySymbol,
          logoURI: getGnotPath(pool.tokenA).logoURI,
          name: getGnotPath(pool.tokenA).name,
        },
        tokenB: {
          ...pool.tokenB,
          symbol: getGnotPath(pool.tokenB).symbol,
          displaySymbol: getGnotPath(pool.tokenB).displaySymbol,
          logoURI: getGnotPath(pool.tokenB).logoURI,
          name: getGnotPath(pool.tokenB).name,
        },
      },
      upDown: "none",
      apr: pool.apr,
    }));
  }, [getGnotPath, pools]);

  async function updatePools() {
    refetchPools();
  }

  return {
    isError,
    isFetchedPools: isFetchedQuery && poolData !== undefined,
    higestAPRs,
    pools,
    poolListInfos,
    updatePools,
    loading,
    gnot,
  };
};
