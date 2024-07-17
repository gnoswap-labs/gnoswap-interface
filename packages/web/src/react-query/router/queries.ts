import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { EstimateSwapRouteResponse } from "@repositories/swap/response/estimate-swap-route-response";

import { QUERY_KEY } from "./types";
import { SwapError } from "@common/errors/swap";
import { wait } from "@utils/common";
import { TokenModel } from "@models/token/token-model";

export const useEstimateSwap = (
  request: {
    inputToken: TokenModel | null;

    outputToken: TokenModel | null;

    tokenAmount: string | number | null;

    exactType: "EXACT_IN" | "EXACT_OUT";
  } | null,
  options?: UseQueryOptions<EstimateSwapRouteResponse, Error>,
) => {
  const { swapRouterRepository } = useGnoswapContext();

  return useQuery<EstimateSwapRouteResponse, Error>({
    queryKey: [
      QUERY_KEY.router,
      request?.inputToken?.path || "",
      request?.outputToken?.path || "",
      request?.exactType || "",
      request?.tokenAmount || "",
    ].filter(item => item),
    queryFn: async () => {
      if (
        !request ||
        !request.inputToken ||
        !request.outputToken ||
        Number.isNaN(request.tokenAmount)
      ) {
        throw new SwapError("INVALID_PARAMS");
      }

      const inputToken = request.inputToken;
      const outputToken = request.outputToken;
      const tokenAmount = Number(request.tokenAmount);

      const result = await wait<EstimateSwapRouteResponse | null>(
        async () =>
          swapRouterRepository
            .estimateSwapRoute({
              inputToken,
              outputToken,
              exactType: request.exactType,
              tokenAmount,
            })
            .catch(e => {
              console.error(e);
              return null;
            }),
        300,
      );

      if (!result) {
        throw new SwapError("NOT_FOUND_SWAP_POOL");
      }

      const availRoute = result.estimatedRoutes.reduce(
        (accumulated, current) => accumulated + current.quote,
        0,
      );

      if (availRoute < 100) {
        throw new SwapError("NOT_FOUND_SWAP_POOL");
      }

      return result;
    },
    retry: false,
    ...options,
  });
};

export const useGetSwapFee = (options?: UseQueryOptions<number, Error>) => {
  const { swapRouterRepository } = useGnoswapContext();

  return useQuery<number, Error>({
    queryKey: [QUERY_KEY.swapFee],
    queryFn: async () => {
      const res = await swapRouterRepository.getSwapFee();

      return res;
    },
    ...options,
  });
};
