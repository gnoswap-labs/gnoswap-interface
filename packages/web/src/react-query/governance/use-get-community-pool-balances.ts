import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { CommunityPoolBalancesInfo } from "@repositories/governance";

// import { QUERY_KEY } from "../query-keys";

const REFETCH_INTERVAL = 60_000;

export const useGetCommunityPoolBalances = (options?: UseQueryOptions<CommunityPoolBalancesInfo, Error>) => {
  const { governanceRepository } = useGnoswapContext();

  return useQuery<CommunityPoolBalancesInfo, Error>({
    queryKey: ["governance-community-pool-balances"],
    queryFn: governanceRepository.getCommunityPoolBalances,
    refetchInterval: REFETCH_INTERVAL,
    refetchOnMount: true,
    refetchOnReconnect: true,
    keepPreviousData: true,
    ...options,
  });
};
