import { useQuery } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { QUERY_KEY } from "@query/query-keys";
import { GetLeaderboardRequest } from "@repositories/leaderboard/request";

export const useGetLeaderboard = (request: GetLeaderboardRequest) => {
  const { leaderboardRepository } = useGnoswapContext();

  return useQuery({
    queryKey: [QUERY_KEY.leaderboardList, request.limit],
    queryFn: async () => {
      const data = await leaderboardRepository.getLeaderboard(request);
      return data;
    },
  });
};
