import { useQuery } from "@tanstack/react-query";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { QUERY_KEY } from "@query/query-keys";
import { SwapFeeTierInfoMap, SwapFeeTierType } from "@constants/option.constant";

interface UseGetPoolTickSpacingOptions {
  enabled?: boolean;
  fallbackFeeTier?: SwapFeeTierType | null;
}

export const useGetPoolTickSpacing = (poolPath: string | null, options?: UseGetPoolTickSpacingOptions) => {
  const { poolRepository } = useGnoswapContext();
  const { enabled = true, fallbackFeeTier } = options || {};

  return useQuery({
    queryKey: [QUERY_KEY.poolTickSpacing, poolPath],
    queryFn: async (): Promise<number> => {
      if (!poolPath) {
        return fallbackFeeTier ? SwapFeeTierInfoMap[fallbackFeeTier].tickSpacing : 1;
      }
      try {
        return await poolRepository.getPoolTickSpacing(poolPath);
      } catch (error) {
        console.error("Failed to get tick spacing:", error);
        return fallbackFeeTier ? SwapFeeTierInfoMap[fallbackFeeTier].tickSpacing : 1;
      }
    },
    enabled: !!poolPath && enabled,
    staleTime: 5_000,
  });
};
