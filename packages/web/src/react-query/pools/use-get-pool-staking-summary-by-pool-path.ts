import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { PoolStakingSummaryModel } from "@models/pool/pool-staking-summary";

import { QUERY_KEY } from "../query-keys";

export const useGetPoolStakingSummaryByPoolPath = (
  poolPath: string,
  options?: UseQueryOptions<PoolStakingSummaryModel | null, Error>,
) => {
  const { poolRepository } = useGnoswapContext();

  return useQuery<PoolStakingSummaryModel | null, Error>({
    queryKey: [QUERY_KEY.poolStakingSummary, poolPath],
    queryFn: () => poolRepository.getPoolStakingSummary(encodeURIComponent(poolPath)),
    refetchOnMount: true,
    ...options,
  });
};
