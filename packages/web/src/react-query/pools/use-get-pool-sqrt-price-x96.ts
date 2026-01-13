import { useQuery } from "@tanstack/react-query";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { QUERY_KEY } from "@query/query-keys";

interface UseGetPoolSqrtPriceX96Options {
  enabled?: boolean;
  refetchInterval?: number | false | ((data: bigint | null | undefined) => number | false);
}

export const useGetPoolSqrtPriceX96 = (poolPath: string | null, options?: UseGetPoolSqrtPriceX96Options) => {
  const { poolRepository } = useGnoswapContext();

  return useQuery({
    queryKey: [QUERY_KEY.poolSqrtPriceX96, poolPath],
    queryFn: async (): Promise<bigint | null> => {
      if (!poolPath) return null;
      try {
        return await poolRepository.getPoolSqrtPriceX96(poolPath);
      } catch (error) {
        console.error("Failed to get sqrtPriceX96:", error);
        return null;
      }
    },
    enabled: !!poolPath && (options?.enabled ?? true),
    staleTime: 5_000,
    refetchInterval: options?.refetchInterval,
  });
};
