import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { CommunityPoolBalancesInfo } from "@repositories/governance";

import { QUERY_KEY } from "../query-keys";

const REFETCH_INTERVAL = 60_000;

export const useGetCommunityPoolBalances = (options?: UseQueryOptions<CommunityPoolBalancesInfo, Error>) => {
  const { governanceRepository } = useGnoswapContext();

  return useQuery<CommunityPoolBalancesInfo, Error>({
    queryKey: [QUERY_KEY.governanceCommunityPoolBalances],
    queryFn: governanceRepository.getCommunityPoolBalances,
    refetchInterval: REFETCH_INTERVAL,
    refetchOnMount: true,
    refetchOnReconnect: true,
    keepPreviousData: true,
    ...options,
  });
};
