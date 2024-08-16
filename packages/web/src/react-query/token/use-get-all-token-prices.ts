import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";

import { QUERY_KEY } from "../query-keys";
import { TokenPriceModel } from "@models/token/token-price-model";

const REFETCH_INTERVAL = 10_000;

export const useGetAllTokenPrices = (
  options?: UseQueryOptions<Record<string, TokenPriceModel>, Error>,
) => {
  const { tokenRepository } = useGnoswapContext();

  return useQuery<Record<string, TokenPriceModel>, Error>({
    queryKey: [QUERY_KEY.tokenPrices],
    queryFn: async () => {
      const res = await tokenRepository.getTokenPrices();
      const priceMap = res.data.reduce<Record<string, TokenPriceModel>>(
        (prev, current) => {
          prev[current.path] = current;
          return prev;
        },
        {},
      );
      return priceMap;
    },
    refetchInterval: REFETCH_INTERVAL,
    ...options,
  });
};