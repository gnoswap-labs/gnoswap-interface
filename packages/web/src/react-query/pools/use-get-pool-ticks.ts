import { useQuery } from "@tanstack/react-query";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { QUERY_KEY } from "@query/query-keys";

interface UseGetPoolTicksOptions {
  enabled?: boolean;
  isReverse?: boolean;
  tickLower?: number;
  tickUpper?: number;
}

export const useGetPoolTicks = (poolPath: string | null, options?: UseGetPoolTicksOptions) => {
  const { poolRepository } = useGnoswapContext();
  const { enabled = true, isReverse = false, tickLower, tickUpper } = options || {};

  return useQuery({
    queryKey: [QUERY_KEY.poolTicks, poolPath, isReverse, tickLower, tickUpper],
    queryFn: async (): Promise<number[]> => {
      if (!poolPath) return [];
      try {
        const result = await poolRepository.getPoolTicks(poolPath, tickLower, tickUpper);
        return result.map(tick => tick * (isReverse ? -1 : 1));
      } catch (error) {
        console.error("Failed to get ticks:", error);
        return [];
      }
    },
    enabled: !!poolPath && enabled,
    staleTime: 5_000,
  });
};
