import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";

import { LaunchpadProjectSummaryModel } from "@models/launchpad";
import { QUERY_KEY } from "../query-keys";

const REFETCH_INTERVAL = 60_000;

export const useGetLaunchpadSummary = (
  options?: UseQueryOptions<LaunchpadProjectSummaryModel, Error>,
) => {
  const { launchpadRepository } = useGnoswapContext();

  return useQuery<LaunchpadProjectSummaryModel, Error>({
    queryKey: [QUERY_KEY.launchpadSummary],
    queryFn: () => {
      return launchpadRepository.getLaunchpadSummary();
    },
    refetchInterval: REFETCH_INTERVAL,
    refetchOnMount: true,
    refetchOnReconnect: true,
    keepPreviousData: true,
    ...options,
  });
};
