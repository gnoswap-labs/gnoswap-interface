import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { CardListPoolInfo } from "@models/common/card-list-item-info";
import { PoolCardInfo } from "@models/pool/info/pool-card-info";
import { PoolListInfo } from "@models/pool/info/pool-list-info";
import { PoolMapper } from "@models/pool/mapper/pool-mapper";
import { PoolDetailModel } from "@models/pool/pool-detail-model";
import { PoolState } from "@states/index";
import { useAtom } from "jotai";
import { useEffect, useMemo } from "react";

export const usePoolData = () => {
  const { poolRepository } = useGnoswapContext();
  const [pools, setPools] = useAtom(PoolState.pools);
  const [isFetchedPools, setIsFetchedPools] = useAtom(PoolState.isFetchedPools);
  const [isFetchedPositions, setIsFetchedPositions] = useAtom(
    PoolState.isFetchedPositions,
  );
  const [loading, setLoading] = useAtom(PoolState.isLoading);
  const { gnot, wugnotPath } = useGnotToGnot();

  const poolListInfos = useMemo(() => {
    const temp = pools?.map(PoolMapper.toListInfo);
    return temp.map((item: PoolListInfo) => {
      return {
        ...item,
        tokenA: item.tokenA
          ? {
              ...item.tokenA,
              symbol:
                item.tokenA.path === wugnotPath
                  ? gnot?.symbol || ""
                  : item.tokenA.symbol,
              logoURI:
                item.tokenA.path === wugnotPath
                  ? gnot?.logoURI || ""
                  : item.tokenA.logoURI,
              name:
                item.tokenA.path === wugnotPath
                  ? gnot?.name || ""
                  : item.tokenA.name,
            }
          : item.tokenA,
        tokenB: item.tokenB
          ? {
              ...item.tokenB,
              symbol:
                item.tokenB.path === wugnotPath
                  ? gnot?.symbol || ""
                  : item.tokenB.symbol,
              logoURI:
                item.tokenB.path === wugnotPath
                  ? gnot?.logoURI || ""
                  : item.tokenB.logoURI,
              name:
                item.tokenB.path === wugnotPath
                  ? gnot?.name || ""
                  : item.tokenB.name,
            }
          : item.tokenB,
      };
    });
  }, [pools, wugnotPath, gnot]);

  const higestAPRs: CardListPoolInfo[] = useMemo(() => {
    const sortedTokens = pools
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
          symbol:
            pool.tokenA.path === wugnotPath
              ? gnot?.symbol || ""
              : pool.tokenA.symbol,
          logoURI:
            pool.tokenA.path === wugnotPath
              ? gnot?.logoURI || ""
              : pool.tokenA.logoURI,
          name:
            pool.tokenA.path === wugnotPath
              ? gnot?.name || ""
              : pool.tokenA.name,
        },
        tokenB: {
          ...pool.tokenB,
          symbol:
            pool.tokenB.path === wugnotPath
              ? gnot?.symbol || ""
              : pool.tokenB.symbol,
          logoURI:
            pool.tokenB.path === wugnotPath
              ? gnot?.logoURI || ""
              : pool.tokenB.logoURI,
          name:
            pool.tokenB.path === wugnotPath
              ? gnot?.name || ""
              : pool.tokenB.name,
        },
      },
      upDown: "none",
      content: pool.apr === "" ? "-" : `${pool.apr || 0}%`,
    }));
  }, [pools]);

  async function updatePositions() {
    setIsFetchedPositions(true);
  }

  const incentivizedPools: PoolCardInfo[] = useMemo(() => {
    const mappedPools = pools
      .filter(pool => pool.incentivizedType !== "NONE_INCENTIVIZED")
      .map(PoolMapper.toCardInfo);
    return mappedPools.map((item: PoolCardInfo) => {
      return {
        ...item,
        tokenA: {
          ...item.tokenA,
          symbol:
            item.tokenA.path === wugnotPath
              ? gnot?.symbol || ""
              : item.tokenA.symbol,
          logoURI:
            item.tokenA.path === wugnotPath
              ? gnot?.logoURI || ""
              : item.tokenA.logoURI,
          name:
            item.tokenA.path === wugnotPath
              ? gnot?.name || ""
              : item.tokenA.name,
        },
        tokenB: {
          ...item.tokenB,
          symbol:
            item.tokenB.path === wugnotPath
              ? gnot?.symbol || ""
              : item.tokenB.symbol,
          logoURI:
            item.tokenB.path === wugnotPath
              ? gnot?.logoURI || ""
              : item.tokenB.logoURI,
          name:
            item.tokenB.path === wugnotPath
              ? gnot?.name || ""
              : item.tokenB.name,
        },
      };
    });
  }, [pools, gnot]);

  async function updatePools() {
    const pools = await poolRepository.getPools();
    setPools(pools);
    setLoading(false);
    setIsFetchedPools(true);
    return pools;
  }

  async function fetchPoolDatils(
    poolId: string,
  ): Promise<PoolDetailModel | null> {
    const currentPools = pools.length === 0 ? await updatePools() : pools;
    const pool = currentPools.find(pool => pool.id === poolId);
    if (!pool) {
      return null;
    }
    return poolRepository.getPoolDetailByPoolPath(pool.path).catch(() => null);
  }

  useEffect(() => {
    updatePools();
  }, []);

  return {
    isFetchedPools,
    higestAPRs,
    isFetchedPositions,
    pools,
    poolListInfos,
    incentivizedPools,
    updatePools,
    updatePositions,
    fetchPoolDatils,
    loading,
    gnot,
  };
};
