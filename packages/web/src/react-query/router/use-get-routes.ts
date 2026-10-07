import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import BigNumber from "bignumber.js";

import { SwapError } from "@common/errors/swap";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { TokenModel } from "@models/token/token-model";
import { GetRoutesResponse } from "@repositories/swap-router/response/get-routes-response";

import { QUERY_KEY } from "../query-keys";

const REFETCH_INTERVAL = 3_000;
const STALE_TIME = 0;

export const useGetRoutes = (
  request: {
    inputToken: TokenModel | null;
    outputToken: TokenModel | null;
    tokenAmount: string | null;
    exactType: "EXACT_IN" | "EXACT_OUT";
  } | null,
  options?: UseQueryOptions<GetRoutesResponse, Error>,
) => {
  const { swapRouterRepository } = useGnoswapContext();

  return useQuery<GetRoutesResponse, Error>({
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
        request.tokenAmount === null ||
        !BigNumber(request.tokenAmount).isFinite()
      ) {
        throw new SwapError("INVALID_PARAMS");
      }

      const inputToken = request.inputToken;
      const outputToken = request.outputToken;
      // Forward the decimal string as-is; Number() would round amounts above 2^53 raw units
      const tokenAmount = request.tokenAmount;

      const result = await swapRouterRepository
        .getRoutes({
          inputToken,
          outputToken,
          exactType: request.exactType,
          tokenAmount,
        })
        .catch(e => {
          console.error(e);
          return null;
        });

      if (!result) {
        return {
          estimatedRoutes: [],
          originAmount: 0,
          amount: "0",
          status: "NO_LIQUIDITY",
        };
      }

      const availRoute = result.estimatedRoutes.reduce((accumulated, current) => accumulated + current.quote, 0);

      if (availRoute < 100) {
        return {
          ...result,
          status: "NO_LIQUIDITY",
        };
      }

      return {
        ...result,
        status: "SUCCESS",
      };
    },
    retry: 1,
    refetchInterval: REFETCH_INTERVAL,
    staleTime: STALE_TIME,
    enabled: !!request?.inputToken?.path && !!request?.outputToken?.path,
    ...options,
  });
};
