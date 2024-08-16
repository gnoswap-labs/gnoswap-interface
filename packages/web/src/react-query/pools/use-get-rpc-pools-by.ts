import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { PoolDetailRPCModel } from "@models/pool/pool-detail-rpc-model";

import { QUERY_KEY } from "../query-keys";

export const useGetRPCPoolsBy = (
  poolPaths: string[],
  options?: UseQueryOptions<PoolDetailRPCModel[], Error>,
) => {
  const { poolRepository } = useGnoswapContext();

  return useQuery<PoolDetailRPCModel[], Error>({
    queryKey: [QUERY_KEY.rpcPools, poolPaths.join("_")],
    queryFn: async () => {
      const pools: PoolDetailRPCModel[] = [];
      for (const poolPath of poolPaths) {
        const pool = await poolRepository
          .getPoolDetailRPCByPoolPath(poolPath)
          .catch(() => null);
        if (pool) {
          pools.push(pool);
        }
      }
      return pools;
    },
    enabled: poolPaths.length > 0,
    ...options,
  });
};
