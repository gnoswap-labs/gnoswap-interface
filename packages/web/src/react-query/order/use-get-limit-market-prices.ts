import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { LimitMarketPricePair } from "@repositories/order/request";
import { LimitPoolMarketPrice } from "@repositories/order/response";
import {
  canonicalizeLimitMarketPricePairs,
  chunkLimitMarketPricePairs,
  getLimitMarketPricePairKey,
} from "@utils/limit-market-price-utils";

import { QUERY_KEY } from "../query-keys";

export type LimitMarketPriceMap = Record<string, LimitPoolMarketPrice | null>;

const REFETCH_INTERVAL = 10_000;

export const useGetLimitMarketPrices = (
  pairs: readonly LimitMarketPricePair[],
  options?: UseQueryOptions<LimitMarketPriceMap, Error>,
) => {
  const { orderRepository } = useGnoswapContext();
  const canonicalPairs = canonicalizeLimitMarketPricePairs(pairs);

  return useQuery<LimitMarketPriceMap, Error>({
    ...options,
    queryKey: [QUERY_KEY.limitMarketPrices, canonicalPairs],
    queryFn: async () => {
      const chunks = chunkLimitMarketPricePairs(canonicalPairs);
      const responses = await Promise.all(chunks.map(chunk => orderRepository.getLimitMarketPrices({ pairs: chunk })));
      const requestedKeys = new Set(canonicalPairs.map(getLimitMarketPricePairKey));
      const pricesByKey = new Map<string, LimitPoolMarketPrice | null>();

      responses.forEach(response => {
        response.items.forEach(item => {
          const key = getLimitMarketPricePairKey(item);
          if (requestedKeys.has(key)) pricesByKey.set(key, item.price);
        });
      });

      const result: LimitMarketPriceMap = {};
      canonicalPairs.forEach(pair => {
        const key = getLimitMarketPricePairKey(pair);
        result[key] = pricesByKey.get(key) ?? null;
      });
      return result;
    },
    keepPreviousData: true,
    enabled: canonicalPairs.length > 0 && (options?.enabled ?? true),
    refetchInterval: REFETCH_INTERVAL,
  });
};
