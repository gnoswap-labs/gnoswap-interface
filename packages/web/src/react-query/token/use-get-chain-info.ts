import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { IChainResponse } from "@repositories/token";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";

import { QUERY_KEY } from "../query-keys";

const REFETCH_INTERVAL = 10_000;

export const useGetChainInfo = (
  options?: UseQueryOptions<IChainResponse, Error>,
) => {
  const { tokenRepository } = useGnoswapContext();

  return useQuery<IChainResponse, Error>({
    queryKey: [QUERY_KEY.chain],
    queryFn: () => tokenRepository.getChain(),
    refetchInterval: REFETCH_INTERVAL,
    ...options,
  });
};
