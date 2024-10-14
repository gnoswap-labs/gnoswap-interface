import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";

import { LaunchpadProjectModel } from "@models/launchpad";
import { QUERY_KEY } from "../query-keys";

const REFETCH_INTERVAL = 60_000;

const PAGE_SIZE = 20;

interface Params {
  keyword?: string;
}

interface LaunchpadProjectsInfinityModel {
  projects: LaunchpadProjectModel[];
  lastCursor: string | null;
  hasNext: boolean;
}

export const useGetLaunchpadProjects = (
  params: Params,
  options?: UseInfiniteQueryOptions<LaunchpadProjectsInfinityModel, Error>,
) => {
  const { launchpadRepository } = useGnoswapContext();

  return useInfiniteQuery<LaunchpadProjectsInfinityModel, Error>({
    queryKey: [QUERY_KEY.launchpadProjects, params.keyword],
    queryFn: ({ pageParam = "" }) => {
      return launchpadRepository
        .getLaunchpadProjects({
          ...params,
          cursor: pageParam,
          size: PAGE_SIZE,
        })
        .then(response => ({
          ...response,
          hasNext: response.projects.length >= PAGE_SIZE,
        }));
    },
    getNextPageParam: lastPage => {
      if (!lastPage.hasNext) return null;
      return lastPage.lastCursor;
    },
    refetchInterval: REFETCH_INTERVAL,
    refetchOnMount: true,
    refetchOnReconnect: true,
    ...options,
  });
};
