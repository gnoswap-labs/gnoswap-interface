import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { PoolBinModel } from "@models/pool/pool-bin-model";

import { QUERY_KEY } from "../query-keys";

export const useGetSimpleBinsByPath = (
  path: string,
  enabled: boolean,
  options?: UseQueryOptions<PoolBinModel[], Error>,
) => {
  const { poolRepository } = useGnoswapContext();
  const count = 20;
  return useQuery<PoolBinModel[], Error>({
    queryKey: [QUERY_KEY.lazyBins, path],
    queryFn: async () => {
      return poolRepository.getBinsOfPoolByPath(path, count);
    },
    ...options,
    enabled: enabled && !!path,
  });
};
