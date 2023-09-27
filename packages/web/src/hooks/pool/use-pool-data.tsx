import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { CardListPoolInfo } from "@models/common/card-list-item-info";
import { PoolState } from "@states/index";
import { useAtom } from "jotai";
import { useMemo } from "react";

export const usePoolData = () => {
  const { poolRepository } = useGnoswapContext();
  const [pools, setPools] = useAtom(PoolState.pools);

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

  async function updatePools() {
    const response = await poolRepository.getPools();
    setPools(response.pools);
  }

  return {
    higestAPRs,
    updatePools,
  };
};