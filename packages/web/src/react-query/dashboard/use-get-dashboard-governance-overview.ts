import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";

import { GovernanceOverviewResponse } from "@repositories/dashboard/response/governance-overview-response";
import { QUERY_KEY } from "../query-keys";

const REFETCH_INTERVAL = 60_000;

export const useGetDashboardGovernanceOverview = (
  options?: UseQueryOptions<GovernanceOverviewResponse | null, Error>,
) => {
  const { dashboardRepository } = useGnoswapContext();

  return useQuery<GovernanceOverviewResponse | null, Error>({
    queryKey: [QUERY_KEY.dashboardGovernanceOverview],
    queryFn: () =>
      dashboardRepository.getDashboardGovernanceOverview().catch(e => {
        console.error(e);
        return null;
      }),
    refetchInterval: REFETCH_INTERVAL,
    keepPreviousData: true,
    ...options,
  });
};
