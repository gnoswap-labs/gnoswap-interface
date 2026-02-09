import { SwapFeeTierInfoMap, SwapFeeTierType } from "@constants/option.constant";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { QUERY_KEY } from "@query/query-keys";
import { useQuery } from "@tanstack/react-query";

interface UseGetPoolTickSpacingOptions {
  enabled?: boolean;
  fallbackFeeTier?: SwapFeeTierType | null;
}

const tickSpacingMap: Record<string, number> = {
  "100": 1,
  "500": 10,
  "3000": 60,
  "10000": 200,
};

export const useGetPoolTickSpacing = (poolPath: string | null, options?: UseGetPoolTickSpacingOptions) => {
  const { poolRepository } = useGnoswapContext();
  const { enabled = true, fallbackFeeTier } = options || {};

  return useQuery({
    queryKey: [QUERY_KEY.poolTickSpacing, poolPath],
    queryFn: async (): Promise<number> => {
      if (!poolPath) {
        return fallbackFeeTier ? SwapFeeTierInfoMap[fallbackFeeTier].tickSpacing : 1;
      }

      const parts = poolPath.split(":");
      if (parts.length === 3) {
        const feeValue = parts[2];
        return tickSpacingMap[feeValue] ?? 1;
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
