import { useMemo } from "react";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { IncentivizePoolCardInfo } from "@models/pool/info/pool-card-info";
import { PoolMapper } from "@models/pool/mapper/pool-mapper";
import { useGetIncentivizePoolList } from "@query/pools";

export const useIncentivizePool = () => {
  const { data = [], isLoading, isFetched } = useGetIncentivizePoolList();
  const { getGnotPath } = useGnotToGnot();

  const incentivizePools: IncentivizePoolCardInfo[] = useMemo(() => {
    const mappedPools = data
      .filter(pool => pool.incentiveType !== "NONE_INCENTIVIZED")
      .map(PoolMapper.toCardInfo);
    mappedPools.sort((x, y) => Number(y.tvl) - Number(x.tvl));
    return mappedPools.map((item: IncentivizePoolCardInfo) => {
      return {
        ...item,
        tokenA: {
          ...item.tokenA,
          symbol: getGnotPath(item.tokenA).symbol,
          logoURI: getGnotPath(item.tokenA).logoURI,
          name: getGnotPath(item.tokenA).name,
        },
        tokenB: {
          ...item.tokenB,
          symbol: getGnotPath(item.tokenB).symbol,
          logoURI: getGnotPath(item.tokenB).logoURI,
          name: getGnotPath(item.tokenB).name,
        },
      };
    });
  }, [data, getGnotPath]);

  return {
    data: incentivizePools,
    isLoading,
    isFetched,
  };
};