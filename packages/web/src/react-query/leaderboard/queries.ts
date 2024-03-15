import { useQuery } from "@tanstack/react-query";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { QUERY_KEY } from "./types";

export function useLeaders() {
  const { leaderboardRepository } = useGnoswapContext();

  const query = useQuery({
    queryKey: QUERY_KEY.leaders(),
    queryFn: () => leaderboardRepository.getLeaders({}),
  });
  return query;
}

export function useLeader(address: string) {
  const { leaderboardRepository } = useGnoswapContext();

  const query = useQuery({
    queryKey: QUERY_KEY.leader(address),
    queryFn: () => leaderboardRepository.getMyLeader({ address }),
  });
  return query;
}
