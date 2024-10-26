import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";

import { LaunchpadParticipationModel } from "@models/launchpad";
import { TokenModel } from "@models/token/token-model";
import { useGetTokens } from "@query/token";
import { QUERY_KEY } from "../query-keys";

const REFETCH_INTERVAL = 60_000;

export const useGetLaunchpadParticipationInfos = (
  projectId: string,
  address: string,
  options?: UseQueryOptions<LaunchpadParticipationModel[], Error>,
) => {
  const { launchpadRepository } = useGnoswapContext();
  const { data: { tokens = [] } = {} } = useGetTokens();

  return useQuery<LaunchpadParticipationModel[], Error>({
    queryKey: [
      QUERY_KEY.launchpadParticipationInfos,
      projectId,
      address,
      tokens.length,
    ],
    queryFn: () => {
      const tokenMap = tokens.reduce<{ [key in string]: TokenModel }>(
        (tokenByPath, current) => {
          tokenByPath[current.path] = current;
          return tokenByPath;
        },
        {},
      );

      return launchpadRepository
        .getLaunchpadParticipationInfos(projectId, address)
        .then(response =>
          response.participationInfos.map(responseInfo => ({
            ...responseInfo,
            rewardToken: tokenMap[responseInfo.rewardTokenPath] || null,
          })),
        );
    },
    refetchInterval: REFETCH_INTERVAL,
    refetchOnMount: true,
    refetchOnReconnect: true,
    keepPreviousData: true,
    ...options,
  });
};
