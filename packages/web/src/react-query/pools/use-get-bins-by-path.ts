import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { PoolBinModel } from "@models/pool/pool-bin-model";

import { QUERY_KEY } from "../query-keys";

export interface PoolBinsResult {
  bins: PoolBinModel[];
  pairedTick: number | null;
}

export const useGetBinsByPath = (
  path: string,
  count?: number,
  currentTick?: number | null,
  options?: UseQueryOptions<PoolBinsResult, Error>,
) => {
  const { poolRepository } = useGnoswapContext();
  return useQuery<PoolBinsResult, Error>({
    queryKey: [QUERY_KEY.bins, path, currentTick ?? null],
    queryFn: async () => {
      const bins = await poolRepository.getBinsOfPoolByPath(path, count);
      return { bins, pairedTick: currentTick ?? null };
    },
    refetchOnMount: true,
    refetchOnReconnect: true,
    keepPreviousData: true,
    ...options,
  });
};
