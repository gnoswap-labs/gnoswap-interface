import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";

import { LaunchpadProjectDetailsInfo } from "@repositories/launchpad/model";
import { QUERY_KEY } from "../query-keys";
import { LaunchpadError } from "@common/errors/launchpad";

const REFETCH_INTERVAL = 60_000;

export const useGetLaunchpadProjectDetails = (
  projectID: string | null,
  options?: UseQueryOptions<LaunchpadProjectDetailsInfo["project"], Error>,
) => {
  const { launchpadRepository } = useGnoswapContext();

  return useQuery<LaunchpadProjectDetailsInfo["project"], Error>({
    queryKey: [QUERY_KEY.launchpadProjectDetails, projectID],
    queryFn: () => {
      if (!projectID) {
        throw new LaunchpadError("NOT_FOUND_PROJECT");
      }
      return launchpadRepository.getLaunchpadProjectDetails(projectID).then(data => data.project);
    },
    refetchInterval: REFETCH_INTERVAL,
    refetchOnMount: true,
    refetchOnReconnect: true,
    keepPreviousData: true,
    ...options,
  });
};
