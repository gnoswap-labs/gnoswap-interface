import { TokenListResponse, TokenPriceListResponse } from "@repositories/token";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { QUERY_KEY } from "./types";

export const useGetTokensList = (
  options?: UseQueryOptions<TokenListResponse, Error>
) => {
  const { tokenRepository } = useGnoswapContext();

  return useQuery<TokenListResponse, Error>({
    queryKey: [QUERY_KEY.tokens],
    queryFn: () => tokenRepository.getTokens(),
    enabled: false,
    ...options,
  });
};

export const useGetTokenPrices = (
  options?: UseQueryOptions<TokenPriceListResponse, Error>
) => {
  const { tokenRepository } = useGnoswapContext();
  return useQuery<TokenPriceListResponse, Error>({
    queryKey: [QUERY_KEY.tokenPrices],
    queryFn: () => tokenRepository.getTokenPrices(),
    ...options,
  });
};
