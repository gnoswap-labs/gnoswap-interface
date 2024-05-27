import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "./types";
import { TvlResponse } from "@repositories/dashboard";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { IVolumeResponse } from "@repositories/dashboard/response/volume-response";

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

export const useGetDashboardVolume = (
  options?: UseQueryOptions<IVolumeResponse, Error>,
) => {
  const { dashboardRepository } = useGnoswapContext();

  return useQuery<IVolumeResponse, Error>({
    queryKey: [QUERY_KEY.dashboardVolume],
    queryFn: dashboardRepository.getDashboardVolume,
    ...options,
  });
};
