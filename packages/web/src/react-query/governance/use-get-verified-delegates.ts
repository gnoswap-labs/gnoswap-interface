import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { VerifiedDelegatesInfo } from "@repositories/governance";

// import { QUERY_KEY } from "../query-keys";

const REFETCH_INTERVAL = 60_000;

export const useGetVerifiedDelegates = (options?: UseQueryOptions<VerifiedDelegatesInfo, Error>) => {
  const { governanceRepository } = useGnoswapContext();

  return useQuery<VerifiedDelegatesInfo, Error>({
    queryKey: ["governance-verified-delegates"],
    queryFn: governanceRepository.getVerifiedDelegates,
    refetchInterval: REFETCH_INTERVAL,
    refetchOnMount: true,
    refetchOnReconnect: true,
    keepPreviousData: true,
    ...options,
  });
};
