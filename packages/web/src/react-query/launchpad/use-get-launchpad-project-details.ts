import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";

import { LaunchpadProjectDetailsModel } from "@models/launchpad";
import { QUERY_KEY } from "../query-keys";

const REFETCH_INTERVAL = 60_000;

export const useGetLaunchpadProjectDetails = (
  projectId: string,
  options?: UseQueryOptions<LaunchpadProjectDetailsModel, Error>,
) => {
  const { launchpadRepository } = useGnoswapContext();

  return useQuery<LaunchpadProjectDetailsModel, Error>({
    queryKey: [QUERY_KEY.launchpadProjectDetails, projectId],
    queryFn: () => {
      return launchpadRepository
        .getLaunchpadProjectDetails(projectId)
        .then(data => data.project);
    },
    refetchInterval: REFETCH_INTERVAL,
    refetchOnMount: true,
    refetchOnReconnect: true,
    keepPreviousData: true,
    ...options,
  });
};
