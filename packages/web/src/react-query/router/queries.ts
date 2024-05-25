import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { EstimateSwapRouteRequest } from "@repositories/swap/request/estimate-swap-route-request";
import { EstimateSwapRouteResponse } from "@repositories/swap/response/estimate-swap-route-response";

import { QUERY_KEY } from "./types";
import { SwapError } from "@common/errors/swap";
import { wait } from "@utils/common";

export const useEstimateSwap = (
  request: EstimateSwapRouteRequest | null,
  options?: UseQueryOptions<EstimateSwapRouteResponse, Error>,
) => {
  const { swapRouterRepository } = useGnoswapContext();

  return useQuery<EstimateSwapRouteResponse, Error>({
    queryKey: [
      QUERY_KEY.router,
      request?.inputToken.path || "",
      request?.outputToken.path || "",
      request?.exactType || "",
      request?.tokenAmount || "",
    ],
    queryFn: async () => {
      if (!request) {
        throw new SwapError("INVALID_PARAMS");
      }

      const result = await wait<EstimateSwapRouteResponse>(
        async () => swapRouterRepository.estimateSwapRoute(request),
        500,
      );

      if (!result) {
        throw new SwapError("NOT_FOUND_SWAP_POOL");
      }

      return result;
    },
    ...options,
  });
};
