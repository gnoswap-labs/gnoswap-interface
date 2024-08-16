import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";

import { QUERY_KEY } from "../query-keys";
import { DashboardTokenResponse } from "@repositories/dashboard/response/token-response";

const REFETCH_INTERVAL = 60_000;

export const useGetDashboardToken = (
  options?: UseQueryOptions<DashboardTokenResponse, Error>,
) => {
  const { dashboardRepository } = useGnoswapContext();

  return useQuery<DashboardTokenResponse, Error>({
    queryKey: [QUERY_KEY.dashboardToken],
    queryFn: dashboardRepository.getDashboardToken,
    refetchInterval: REFETCH_INTERVAL,
    ...options,
  });
};
