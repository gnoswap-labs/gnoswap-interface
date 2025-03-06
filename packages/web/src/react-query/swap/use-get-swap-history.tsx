import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { QUERY_KEY } from "@query/query-keys";
import { SwapHistoryRequest } from "@repositories/swap/request/swap-history-request";
import { SwapHistoryItem } from "@repositories/swap/response/swap-history-response";

const REFETCH_INTERVAL = 5_000;

export const useGetSwapHistory = (params: SwapHistoryRequest, options?: UseQueryOptions<SwapHistoryItem[] | null>) => {
  const { swapRepository } = useGnoswapContext();

  return useQuery<SwapHistoryItem[] | null>({
    queryKey: [QUERY_KEY.swapHistory, params.tokenAPath, params.tokenBPath],
    queryFn: async () => {
      const response = await swapRepository.getSwapHistory({ ...params });
      return response;
    },
    refetchInterval: REFETCH_INTERVAL,
    refetchOnMount: true,
    refetchOnReconnect: true,
    ...options,
  });
};
