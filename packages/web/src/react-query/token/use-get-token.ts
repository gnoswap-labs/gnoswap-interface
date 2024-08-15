import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { ITokenResponse } from "@repositories/token";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";

import { QUERY_KEY } from "../query-keys";
import { TokenError } from "@common/errors/token";

export const useGetToken = (
  path: string | null,
  options?: UseQueryOptions<ITokenResponse, Error>,
) => {
  const { tokenRepository } = useGnoswapContext();

  return useQuery<ITokenResponse, Error>({
    queryKey: [QUERY_KEY.tokenByPath, path || ""],
    queryFn: () => {
      if (!path) {
        throw new TokenError("NO_MATCH_TOKENID");
      }
      return tokenRepository.getTokenByPath(path);
    },
    staleTime: Infinity,
    ...options,
  });
};
