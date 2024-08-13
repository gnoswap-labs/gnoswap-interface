import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { IVolumeResponse } from "@repositories/dashboard/response/volume-response";

import { QUERY_KEY } from "../query-keys";

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