import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { GovernanceSummaryInfo2 } from "@repositories/governance";

// import { QUERY_KEY } from "../query-keys";

const REFETCH_INTERVAL = 60_000;

export const useGetGovernanceSummary2 = (options?: UseQueryOptions<GovernanceSummaryInfo2, Error>) => {
  const { governanceRepository } = useGnoswapContext();

  return useQuery<GovernanceSummaryInfo2, Error>({
    queryKey: ["governance-summary-2"],
    queryFn: governanceRepository.getGovernanceSummary2,
    refetchInterval: REFETCH_INTERVAL,
    refetchOnMount: true,
    refetchOnReconnect: true,
    keepPreviousData: true,
    ...options,
  });
};
