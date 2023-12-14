import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { CardListPoolInfo } from "@models/common/card-list-item-info";
import { PoolCardInfo } from "@models/pool/info/pool-card-info";
import { PoolMapper } from "@models/pool/mapper/pool-mapper";
import { PoolDetailModel } from "@models/pool/pool-detail-model";
import { PoolState } from "@states/index";
import { useAtom } from "jotai";
import { useMemo } from "react";

export const usePoolData = () => {
  const { poolRepository } = useGnoswapContext();
  const [pools, setPools] = useAtom(PoolState.pools);
  const [isFetchedPools, setIsFetchedPools] = useAtom(PoolState.isFetchedPools);
  const [isFetchedPositions, setIsFetchedPositions] = useAtom(PoolState.isFetchedPositions);
  const [loading, setLoading] = useAtom(PoolState.isLoading);

  const poolListInfos = useMemo(() => {
    return pools?.map(PoolMapper.toListInfo);
  }, [pools]);
  
  const higestAPRs: CardListPoolInfo[] = useMemo(() => {
    const sortedTokens = pools.sort((p1, p2) => {
      const p2Apr = p2.apr;
      const p1Apr = p1.apr;
      return p2Apr - p1Apr;
    }).filter((_, index) => index < 3);
    return sortedTokens?.map(pool => ({
      pool,
      upDown: "none",
      content: `${pool.apr || 0}%`
    }));
  }, [pools]);

  async function updatePositions() {
    setIsFetchedPositions(true);
  }
  const incentivizedPools: PoolCardInfo[] = useMemo(() => {
    return pools
      ?.map(PoolMapper.toCardInfo)
      .filter(info => info.incentivizedType !== "NON_INCENTIVIZED");
  }, [pools]);

  async function updatePools() {
    const pools = await poolRepository.getPools();
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