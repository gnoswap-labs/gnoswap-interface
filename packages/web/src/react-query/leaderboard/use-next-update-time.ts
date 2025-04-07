import { useQuery } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { QUERY_KEY } from "@query/query-keys";

export const refetchingOptions = {
  staleTime: 0,
  enabled: true,
  refetchOnMount: true,
  refetchOnReconnect: true,
  refetchOnWindowFocus: true,
};

export function useNextUpdateTime() {
  const { leaderboardRepository } = useGnoswapContext();

  return useQuery({
    queryKey: [QUERY_KEY.leaderboardNextUpdate],
    queryFn: () => leaderboardRepository.getNextUpdateTime(),
    ...refetchingOptions,
  });
}
