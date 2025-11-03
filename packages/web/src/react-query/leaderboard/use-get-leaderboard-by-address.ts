import { useQuery } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { QUERY_KEY } from "@query/query-keys";

const REFETCH_INTERVAL = 5_000;

export const useGetLeaderboardByAddress = (address: string) => {
  const { leaderboardRepository } = useGnoswapContext();

  return useQuery({
    queryKey: [QUERY_KEY.leaderboardListByAddress, address],
    enabled: !!address,
    queryFn: async () => {
      const data = await leaderboardRepository.getLeaderboardByAddress(address);
      return data?.user;
    },
    refetchInterval: REFETCH_INTERVAL,
  });
};
