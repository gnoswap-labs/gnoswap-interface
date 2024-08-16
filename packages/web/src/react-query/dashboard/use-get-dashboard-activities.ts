import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";

import { QUERY_KEY } from "../query-keys";
import { ActivityResponse } from "@repositories/activity/responses/activity-responses";

type ActivityType =
  | "All"
  | "Swaps"
  | "Adds"
  | "Removes"
  | "Stakes"
  | "Unstakes"
  | "Claims";

const REFETCH_INTERVAL = 10_000;

export const useGetDashboardActivities = (
  activityType: ActivityType,
  options?: UseQueryOptions<ActivityResponse, Error>,
) => {
  const { dashboardRepository } = useGnoswapContext();

  return useQuery<ActivityResponse, Error>({
    queryKey: [QUERY_KEY.dashboardActivities, activityType],
    queryFn: () => {
      return dashboardRepository.getDashboardOnchainActivity({
        type: activityType,
      });
    },
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchInterval: REFETCH_INTERVAL,
    ...options,
  });
};
