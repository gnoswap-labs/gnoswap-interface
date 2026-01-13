import { useQuery } from "@tanstack/react-query";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { QUERY_KEY } from "@query/query-keys";

interface PoolRPCData {
  poolPath: string;
  liquidity: bigint;
  sqrtPriceX96: bigint;
  fee: number;
}

export const useGetRPCPoolsBy = (poolPaths: string[]) => {
  const { poolRepository } = useGnoswapContext();

  return useQuery({
    queryKey: [QUERY_KEY.rpcPools, poolPaths],
    queryFn: async (): Promise<PoolRPCData[]> => {
      if (!poolRepository || poolPaths.length === 0) {
        return [];
      }

      const poolDataPromises = poolPaths.map(async poolPath => {
        try {
          const parts = poolPath.split(":");
          const fee = parts.length === 3 ? parseInt(parts[2]) : 0;

          const [liquidity, sqrtPriceX96] = await Promise.all([
            poolRepository.getPoolLiquidity(poolPath).catch(() => "0"),
            poolRepository.getPoolSqrtPriceX96(poolPath).catch(() => 0n),
          ]);

          return {
            poolPath,
            liquidity: BigInt(liquidity),
            sqrtPriceX96,
            fee,
          };
        } catch (error) {
          console.error(`Failed to fetch pool data for ${poolPath}:`, error);
          return {
            poolPath,
            liquidity: 0n,
            sqrtPriceX96: 0n,
            fee: 0,
          };
        }
      });

      return Promise.all(poolDataPromises);
    },
    enabled: poolPaths.length > 0,
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 60,
  });
};
