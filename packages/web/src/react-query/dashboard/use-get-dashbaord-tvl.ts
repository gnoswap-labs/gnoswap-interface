import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { TvlResponse } from "@repositories/dashboard";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";

import { QUERY_KEY } from "../query-keys";

export const useGetDashboardTVL = (
  options?: UseQueryOptions<TvlResponse, Error>,
) => {
  const { dashboardRepository } = useGnoswapContext();

  return useQuery<TvlResponse, Error>({
    queryKey: [QUERY_KEY.dashboardTvl],
    queryFn: dashboardRepository.getDashboardTvl,
    ...options,
  });
};