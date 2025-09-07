import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";

import { LaunchpadProjectDetailsItemInfo } from "@repositories/launchpad/model";
import { QUERY_KEY } from "../query-keys";
import { LaunchpadError } from "@common/errors/launchpad";

const REFETCH_INTERVAL = 60_000;

export const useGetLaunchpadProjectDetails = (
  projectId: string | null,
  options?: UseQueryOptions<LaunchpadProjectDetailsItemInfo, Error>,
) => {
  const { launchpadRepository } = useGnoswapContext();

  return useQuery<LaunchpadProjectDetailsItemInfo, Error>({
    queryKey: [QUERY_KEY.launchpadProjectDetails, projectId],
    queryFn: () => {
      if (!projectId) {
        throw new LaunchpadError("NOT_FOUND_PROJECT");
      }
      return launchpadRepository.getLaunchpadProjectDetails(projectId).then(data => data.project);
    },
    refetchInterval: REFETCH_INTERVAL,
    refetchOnMount: true,
    refetchOnReconnect: true,
    keepPreviousData: true,
    ...options,
  });
};
