import { position } from "@components/earn/earn-my-positions/EarnMyPositions.stories";
import { PoolPosition } from "@containers/earn-my-position-container/EarnMyPositionContainer";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { CardListPoolInfo } from "@models/common/card-list-item-info";
import { PoolCardInfo } from "@models/pool/info/pool-card-info";
import { PoolMapper } from "@models/pool/mapper/pool-mapper";
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

  const myPositions: PoolPosition[] = useMemo(() => {
    return [position, position, position];
  }, []);
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
  }

  return {
    isFetchedPools,
    higestAPRs,
    isFetchedPositions,
    myPositions,
    pools,
    poolListInfos,
    incentivizedPools,
    updatePools,
    updatePositions,
    loading,
  };
};