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
      const p2Apr = Math.max(...p2.bins.map(b => b.apr)) || 0;
      const p1Apr = Math.max(...p2.bins.map(b => b.apr)) || 0;
      return p2Apr - p1Apr;
    }).filter((_, index) => index < 3);
    return sortedTokens?.map(pool => ({
      pool,
      upDown: "none",
      content: `${Math.max(...pool.bins.map(b => b.apr)) || 0}%`
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
      .filter(info => info.incentiveType === "Incentivized");
  }, [pools]);

  async function updatePools() {
    const response = await poolRepository.getPools();
    setPools(response.pools);
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