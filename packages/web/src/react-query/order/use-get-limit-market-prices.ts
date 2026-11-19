import { useQueries, UseQueryOptions } from "@tanstack/react-query";
import { useRef } from "react";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { LimitMarketPricePair } from "@repositories/order/request";
import { LimitPoolMarketPrice } from "@repositories/order/response";
import { canonicalizeLimitMarketPricePairs, getLimitMarketPricePairKey } from "@utils/limit-market-price-utils";

import { QUERY_KEY } from "../query-keys";

export type LimitMarketPriceMap = Record<string, LimitPoolMarketPrice | null>;

const REFETCH_INTERVAL = 10_000;
const STALE_TIME = 10_000;

export const useGetLimitMarketPrices = (
  pairs: readonly LimitMarketPricePair[],
  options?: Pick<UseQueryOptions<LimitPoolMarketPrice | null, Error>, "enabled">,
) => {
  const { orderRepository } = useGnoswapContext();
  const canonicalPairs = canonicalizeLimitMarketPricePairs(pairs);
  const queries = useQueries({
    queries: canonicalPairs.map(pair => ({
      queryKey: [QUERY_KEY.limitMarketPrices, getLimitMarketPricePairKey(pair)],
      queryFn: async () => (await orderRepository.getLimitMarketPrice(pair)).price,
      enabled: options?.enabled ?? true,
      staleTime: STALE_TIME,
      refetchOnMount: true,
      refetchInterval: REFETCH_INTERVAL,
    })),
  });

  const dataRef = useRef<LimitMarketPriceMap>({});
  // Query result wrappers change during refetches; publish only changed pairs or prices.
  const changed =
    Object.keys(dataRef.current).length !== canonicalPairs.length ||
    canonicalPairs.some((pair, index) => {
      const result = queries[index];
      return dataRef.current[getLimitMarketPricePairKey(pair)] !== (result.isError ? null : (result.data ?? null));
    });
  if (changed) {
    const data: LimitMarketPriceMap = {};
    canonicalPairs.forEach((pair, index) => {
      const result = queries[index];
      data[getLimitMarketPricePairKey(pair)] = result.isError ? null : (result.data ?? null);
    });
    dataRef.current = data;
  }

  return { data: dataRef.current };
};
