import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { LaunchpadProjectModel } from "@models/launchpad";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { QUERY_KEY } from "../query-keys";

const REFETCH_INTERVAL = 60_000;

export const useGetLaunchpadActiveProjects = (
  options?: UseQueryOptions<LaunchpadProjectModel[], Error>,
) => {
  const { launchpadRepository } = useGnoswapContext();

  return useQuery<LaunchpadProjectModel[], Error>({
    queryKey: [QUERY_KEY.launchpadActiveProjects],
    queryFn: () => {
      return launchpadRepository
        .getLaunchpadProjects({
          size: 1_000,
          isActive: true,
        })
        .then(response => response.projects);
    },
    refetchInterval: REFETCH_INTERVAL,
    refetchOnMount: true,
    refetchOnReconnect: true,
    keepPreviousData: true,
    ...options,
  });
};
