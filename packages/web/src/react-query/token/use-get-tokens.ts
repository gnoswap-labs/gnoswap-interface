import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { TokenListResponse } from "@repositories/token";

import { QUERY_KEY } from "../query-keys";

export const useGetTokens = (
  options?: UseQueryOptions<TokenListResponse, Error>,
) => {
  const { tokenRepository } = useGnoswapContext();

  return useQuery<TokenListResponse, Error>({
    queryKey: [QUERY_KEY.tokens],
    queryFn: () => tokenRepository.getTokens(),
    staleTime: Infinity,
    ...options,
  });
};
