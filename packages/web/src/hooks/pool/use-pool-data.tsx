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

  const poolListInfos = useMemo(() => {
    return pools.map(PoolMapper.toListInfo);
  }, [pools]);

  const higestAPRs: CardListPoolInfo[] = useMemo(() => {
    const sortedTokens = pools.sort((p1, p2) => {
      return p2.topBin.annualizedFeeGrowth - p1.topBin.annualizedFeeGrowth;
    }).filter((_, index) => index < 3);
    return sortedTokens.map(pool => ({
      pool,
      upDown: "none",
      content: `${pool.topBin.annualizedFeeGrowth}%`
    }));
  }, [pools]);

  const myPositions: PoolPosition[] = useMemo(() => {
    return [];
  }, []);
  async function updatePositions() {
    setIsFetchedPositions(true);
  }

  const incentivizedPools: PoolCardInfo[] = useMemo(() => {
    return pools
      .map(PoolMapper.toCardInfo)
      .filter(info => info.incentiveType === "Incentivized");
  }, [pools]);

  async function updatePools() {
    const response = await poolRepository.getPools();
    setPools(response.pools);
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
  };
};