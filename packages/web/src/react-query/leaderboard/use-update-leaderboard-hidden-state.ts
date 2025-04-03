import { useMutation, useQueryClient } from "@tanstack/react-query";

import { QUERY_KEY } from "@query/query-keys";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { UpdateLeaderboardHiddenStateRequest } from "@repositories/leaderboard/request";

export const useUpdateLeaderboardHiddenState = () => {
  const queryClient = useQueryClient();
  const { leaderboardRepository } = useGnoswapContext();

  return useMutation({
    mutationFn: async (request: UpdateLeaderboardHiddenStateRequest) => {
      return await leaderboardRepository.updateLeaderboardHiddenState(request);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.leaderboardList] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.leaderboardList, variables.address] });
    },
  });
};
