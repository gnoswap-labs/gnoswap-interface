import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { ITokenDetailResponse } from "@repositories/token";
import { TokenError } from "@common/errors/token";

import { QUERY_KEY } from "../query-keys";

export const useGetTokenDetails = (
  path: string | null,
  options?: UseQueryOptions<ITokenDetailResponse, Error>,
) => {
  const { tokenRepository } = useGnoswapContext();

  return useQuery<ITokenDetailResponse, Error>({
    queryKey: [QUERY_KEY.tokenDetails, path || ""],
    queryFn: () => {
      if (!path) {
        throw new TokenError("NO_MATCH_TOKENID");
      }
      return tokenRepository.getTokenDetailByPath(path);
    },
    refetchOnMount: true,
    refetchOnReconnect: true,
    ...options,
  });
};
