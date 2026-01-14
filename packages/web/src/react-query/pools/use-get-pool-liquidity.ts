import { useQuery } from "@tanstack/react-query";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { QUERY_KEY } from "@query/query-keys";

interface UseGetPoolLiquidityOptions {
  enabled?: boolean;
  refetchInterval?: number | false | ((data: bigint | undefined) => number | false);
}

export const useGetPoolLiquidity = (poolPath: string | null, options?: UseGetPoolLiquidityOptions) => {
  const { poolRepository } = useGnoswapContext();

  return useQuery({
    queryKey: [QUERY_KEY.poolLiquidity, poolPath],
    queryFn: async (): Promise<bigint> => {
      if (!poolPath) return 0n;
      try {
        const result = await poolRepository.getPoolLiquidity(poolPath);
        return BigInt(result);
      } catch (error) {
        console.error("Failed to get liquidity:", error);
        return 0n;
      }
    },
    enabled: !!poolPath && (options?.enabled ?? true),
    staleTime: 5_000,
    refetchInterval: options?.refetchInterval,
  });
};
