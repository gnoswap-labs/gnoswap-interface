import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { PoolModel } from "@models/pool/pool-model";

import { QUERY_KEY } from "../query-keys";

const REFETCH_INTERVAL = 60_000;

export const useGetPoolList = (
  options?: UseQueryOptions<PoolModel[], Error>,
) => {
  const { poolRepository } = useGnoswapContext();

  return useQuery<PoolModel[], Error>({
    queryKey: [QUERY_KEY.pools],
    queryFn: async () => {
      const data = await poolRepository.getPools();
      data.sort(
        (a: PoolModel, b: PoolModel) => -Number(a.price) + Number(b.price),
      );
      return data;
    },
    refetchInterval: REFETCH_INTERVAL,
    ...options,
  });
};
