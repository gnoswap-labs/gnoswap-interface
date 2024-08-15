import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";

import { QUERY_KEY } from "../query-keys";
import { TokenPriceModel } from "@models/token/token-price-model";
import { TokenError } from "@common/errors/token";

export const useGetTokenPrices = (
  path: string | null,
  options?: UseQueryOptions<TokenPriceModel, Error>,
) => {
  const { tokenRepository } = useGnoswapContext();

  return useQuery<TokenPriceModel, Error>({
    queryKey: [QUERY_KEY.tokenPrices, path || ""],
    queryFn: () => {
      if (!path) {
        throw new TokenError("NO_MATCH_TOKENID");
      }
      return tokenRepository.getTokenPricesByPath(path);
    },
    refetchOnMount: true,
    refetchOnReconnect: true,
    ...options,
  });
};
