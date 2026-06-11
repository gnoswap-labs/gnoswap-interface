import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";

import { QUERY_KEY } from "../query-keys";

export const useGetAllowedExternalRewardTokenPaths = (options?: UseQueryOptions<string[], Error>) => {
  const { poolRepository } = useGnoswapContext();

  return useQuery<string[], Error>({
    queryKey: [QUERY_KEY.allowedExternalRewardTokenPaths],
    queryFn: async () => {
      return poolRepository.getAllowedExternalRewardTokenPaths();
    },
    staleTime: 30_000,
    ...options,
  });
};
