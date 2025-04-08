import { useQuery } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { QUERY_KEY } from "@query/query-keys";

export const useGetLeaderboardByAddress = (address: string) => {
  const { leaderboardRepository } = useGnoswapContext();

  return useQuery({
    queryKey: [QUERY_KEY.leaderboardListByAddress, address],
    enabled: !!address,
    queryFn: async () => {
      const data = await leaderboardRepository.getLeaderboardByAddress(address);
      return data?.user;
    },
  });
};
