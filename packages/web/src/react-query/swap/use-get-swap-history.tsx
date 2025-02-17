import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { QUERY_KEY } from "@query/query-keys";
import { SwapHistoryRequest } from "@repositories/swap/request/swap-history-request";
import { SwapHistoryResponse } from "@repositories/swap/response/swap-history-response";

const REFETCH_INTERVAL = 10_000;

export const useGetSwapHistory = (
  params: SwapHistoryRequest,
  options?: UseQueryOptions<SwapHistoryResponse[] | null>,
) => {
  const { swapRepository } = useGnoswapContext();

  return useQuery<SwapHistoryResponse[] | null>({
    queryKey: [QUERY_KEY.swapHistory, params.tokenAPath, params.tokenBPath],
    queryFn: async () => {
      return swapRepository.getSwapHistory({ ...params }).then(response => ({
        ...response,
      }));
    },
    refetchInterval: REFETCH_INTERVAL,
    refetchOnMount: true,
    refetchOnReconnect: true,
    ...options,
  });
};
