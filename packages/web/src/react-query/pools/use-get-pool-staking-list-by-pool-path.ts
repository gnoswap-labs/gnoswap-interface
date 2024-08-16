import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { PoolStakingModel } from "@models/pool/pool-staking";

import { QUERY_KEY } from "../query-keys";

export const useGetPoolStakingListByPoolPath = (
  poolPath: string,
  options?: UseQueryOptions<PoolStakingModel[], Error>,
) => {
  const { poolRepository } = useGnoswapContext();

  return useQuery<PoolStakingModel[], Error>({
    queryKey: [QUERY_KEY.poolStakingList, poolPath],
    queryFn: async () => {
      const data = await poolRepository.getPoolStakingList(
        encodeURIComponent(poolPath),
      );

      return data;
    },
    ...options,
  });
};
