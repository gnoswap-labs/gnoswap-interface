import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { SwapError } from "@common/errors/swap";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { TokenModel } from "@models/token/token-model";
import { EstimateSwapRouteResponse } from "@repositories/swap/response/estimate-swap-route-response";
import { wait } from "@utils/common";

import { QUERY_KEY } from "../query-keys";

export const useGetRoutes = (
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
            .getRoutes({
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
    // retry: false,
    enabled: !!request?.inputToken?.path && !!request?.outputToken?.path,
    ...options,
  });
};

