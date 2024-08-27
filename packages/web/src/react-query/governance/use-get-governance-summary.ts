import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { GovernanceSummary } from "@repositories/governance";

import { QUERY_KEY } from "../query-keys";

const REFETCH_INTERVAL = 10_000;

export const useGetGovernanceSummary = (
  options?: UseQueryOptions<GovernanceSummary, Error>,
) => {
  const { governanceRepository } = useGnoswapContext();

  return useQuery<GovernanceSummary, Error>({
    queryKey: [QUERY_KEY.governanceSummary],
    queryFn: governanceRepository.getGovernanceSummary,
    refetchInterval: REFETCH_INTERVAL,
    refetchOnMount: true,
    refetchOnReconnect: true,
    ...options,
  });
};
