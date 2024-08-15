import { useMemo } from "react";

import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { CardListPoolInfo } from "@models/common/card-list-item-info";
import { PoolListInfo } from "@models/pool/info/pool-list-info";
import { PoolMapper } from "@models/pool/mapper/pool-mapper";
import { useGetPoolList } from "@query/pools";

export const usePoolData = () => {
  const {
    data: pools = [],
    isLoading: loading,
    isFetched: isFetchedPools,
    refetch: refetchPools,
  } = useGetPoolList();

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
              logoURI: getGnotPath(item.tokenA).logoURI,
              name: getGnotPath(item.tokenA).name,
            }
          : item.tokenA,
        tokenB: item.tokenB
          ? {
              ...item.tokenB,
              symbol: getGnotPath(item.tokenB).symbol,
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
          logoURI: getGnotPath(pool.tokenA).logoURI,
          name: getGnotPath(pool.tokenA).name,
        },
        tokenB: {
          ...pool.tokenB,
          symbol: getGnotPath(pool.tokenB).symbol,
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
    isFetchedPools,
    higestAPRs,
    pools,
    poolListInfos,
    updatePools,
    loading,
    gnot,
  };
};
