import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useWallet } from "@hooks/wallet/data/use-wallet";

import { QUERY_KEY } from "../query-keys";

export const useGetAllowedExternalRewardTokenPaths = (options?: UseQueryOptions<string[], Error>) => {
  const { poolRepository } = useGnoswapContext();
  const { currentChainId } = useWallet();

  return useQuery<string[], Error>({
    queryKey: [QUERY_KEY.allowedExternalRewardTokenPaths, currentChainId],
    queryFn: async () => {
      return poolRepository.getAllowedExternalRewardTokenPaths();
    },
    staleTime: 30_000,
    ...options,
  });
};
