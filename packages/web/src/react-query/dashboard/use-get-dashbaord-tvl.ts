import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { TvlResponse } from "@repositories/dashboard";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";

import { QUERY_KEY } from "../query-keys";

const REFETCH_INTERVAL = 10_000;

export const useGetDashboardTVL = (
  options?: UseQueryOptions<TvlResponse, Error>,
) => {
  const { dashboardRepository } = useGnoswapContext();

  return useQuery<TvlResponse, Error>({
    queryKey: [QUERY_KEY.dashboardTvl],
    queryFn: dashboardRepository.getDashboardTvl,
    refetchInterval: REFETCH_INTERVAL,
    refetchOnMount: true,
    refetchOnReconnect: true,
    ...options,
  });
};
