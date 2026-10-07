import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { PoolLiquidityTickModel } from "@models/pool/pool-liquidity-model";
import { PoolRepository } from "@repositories/pool";

import { QUERY_KEY } from "../query-keys";

interface UseGetLiquidityTicksByPathOptions
  extends Omit<UseQueryOptions<PoolLiquidityTickModel[], Error>, "queryFn" | "queryKey"> {
  enabled?: boolean;
  queryKey?: readonly unknown[];
}

export const createGetLiquidityTicksByPathQueryKey = (poolPath: string | null | undefined) => [
  QUERY_KEY.poolLiquidityTicks,
  poolPath ?? null,
];

export const createGetLiquidityTicksByPathQueryOptions = (
  poolRepository: Pick<PoolRepository, "getLiquidityTicksOfPoolByPath">,
  poolPath: string | null | undefined,
  options?: UseGetLiquidityTicksByPathOptions,
) => {
  const { queryKey: extraQueryKey, enabled: callerEnabled, ...restOptions } = options ?? {};
  const baseQueryKey = createGetLiquidityTicksByPathQueryKey(poolPath);

  return {
    queryKey: extraQueryKey ? [...baseQueryKey, ...extraQueryKey] : baseQueryKey,
    queryFn: async () => {
      if (!poolPath) {
        return [];
      }
      return poolRepository.getLiquidityTicksOfPoolByPath(poolPath);
    },
    refetchOnMount: true,
    refetchOnReconnect: true,
    staleTime: 5_000,
    ...restOptions,
    enabled: !!poolPath && (callerEnabled ?? true),
  };
};

export const useGetLiquidityTicksByPath = (
  poolPath: string | null | undefined,
  options?: UseGetLiquidityTicksByPathOptions,
) => {
  const { poolRepository } = useGnoswapContext();

  return useQuery<PoolLiquidityTickModel[], Error>(
    createGetLiquidityTicksByPathQueryOptions(poolRepository, poolPath, options),
  );
};
