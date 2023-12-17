import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { CardListPoolInfo } from "@models/common/card-list-item-info";
import { PoolCardInfo } from "@models/pool/info/pool-card-info";
import { PoolMapper } from "@models/pool/mapper/pool-mapper";
import { PoolDetailModel } from "@models/pool/pool-detail-model";
import { PoolState } from "@states/index";
import { useAtom } from "jotai";
import { useMemo } from "react";
const WRAPPED_GNOT_PATH = process.env.NEXT_PUBLIC_WRAPPED_GNOT_PATH || "";

export const usePoolData = () => {
  const { poolRepository } = useGnoswapContext();
  const [pools, setPools] = useAtom(PoolState.pools);
  const [isFetchedPools, setIsFetchedPools] = useAtom(PoolState.isFetchedPools);
  const [isFetchedPositions, setIsFetchedPositions] = useAtom(PoolState.isFetchedPositions);
  const [loading, setLoading] = useAtom(PoolState.isLoading);
  const { gnot } = useGnotToGnot();
  
  const poolListInfos = useMemo(() => {
    return pools?.map(PoolMapper.toListInfo);
  }, [pools]);
  
  const higestAPRs: CardListPoolInfo[] = useMemo(() => {
    const sortedTokens = pools.sort((p1, p2) => {
      const p2Apr = p2.apr;
      const p1Apr = p1.apr;
      return Number(p2Apr) - Number(p1Apr);
    }).filter((_, index) => index < 3);
    return sortedTokens?.map(pool => ({
      pool,
      upDown: "none",
      content: pool.apr === "" ? "-" : `${pool.apr || 0}%`
    }));
  }, [pools]);
  
  async function updatePositions() {
    setIsFetchedPositions(true);
  }
  const incentivizedPools: PoolCardInfo[] = useMemo(() => {
    const temp = pools
      ?.map(PoolMapper.toCardInfo);
    return temp.map((item: PoolCardInfo) => {
      return {
        ...item,
        tokenA: {
          ...item.tokenA,
          symbol: item.tokenA.path === WRAPPED_GNOT_PATH ? (gnot?.symbol || "") : item.tokenA.symbol,
          logoURI: item.tokenA.path === WRAPPED_GNOT_PATH ? (gnot?.logoURI || "") : item.tokenA.logoURI,
        },
        tokenB: {
          ...item.tokenB,
          symbol: item.tokenB.path === WRAPPED_GNOT_PATH ? (gnot?.symbol || "") : item.tokenB.symbol,
          logoURI: item.tokenB.path === WRAPPED_GNOT_PATH ? (gnot?.logoURI || "") : item.tokenB.logoURI,
        }
      };
    });
  }, [pools, gnot]);

  async function updatePools() {
    const pools = await poolRepository.getPools();
    // const mapPool = pools.map((item: PoolModel) => {
    //   return {
    //     ...item,
    //     tokenA: {
    //       ...
    //     }
    //   };
    // });
    setPools(pools);
    setLoading(false);
    setIsFetchedPools(true);
    return pools;
  }

  async function fetchPoolDatils(poolId: string): Promise<PoolDetailModel | null> {
    const currentPools = pools.length === 0 ? await updatePools() : pools;
    const pool = currentPools.find(pool => pool.id === poolId);
    if (!pool) {
      return null;
    }
    return poolRepository.getPoolDetailByPoolPath(pool.path).catch(() => null);
  }

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
  };
};