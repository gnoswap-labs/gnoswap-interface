import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { PoolBinModel } from "@models/pool/pool-bin-model";

import { QUERY_KEY } from "../query-keys";

export const useGetBinsByPath = (
  path: string,
  count?: number,
  options?: UseQueryOptions<PoolBinModel[], Error>,
) => {
  const { poolRepository } = useGnoswapContext();
  return useQuery<PoolBinModel[], Error>({
    queryKey: [QUERY_KEY.bins, path],
    queryFn: async () => {
      return poolRepository.getBinsOfPoolByPath(path, count);
    },
    refetchOnMount: true,
    refetchOnReconnect: true,
    ...options,
  });
};
