import { useQueries } from "@tanstack/react-query";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { QUERY_KEY } from "./types";
import { useAtomValue } from "jotai";
import { WalletState } from "@states/index";

export function useLeaders() {
  const account = useAtomValue(WalletState.account);
  const { leaderboardRepository } = useGnoswapContext();

  const results = useQueries({
    queries: [
      {
        queryKey: QUERY_KEY.leaders(),
        queryFn: () => leaderboardRepository.getLeaders({}),
        suspense: true,
      },
      {
        queryKey: QUERY_KEY.leader(account?.address),
        queryFn: () => {
          if (!account?.address) return null;

          return leaderboardRepository.getLeaderByAddress({
            address: account.address,
          });
        },
        suspense: true,
      },
    ],
  });

  return results;
}

// export function useLeaders() {
//   const { leaderboardRepository } = useGnoswapContext();
//
//   const query = useQuery<GetLeadersResponse>({
//     queryKey: QUERY_KEY.leaders(),
//     queryFn: () => leaderboardRepository.getLeaders({}),
//     suspense: true,
//   });
//
//   return query;
// }
//
// export function useLeader(address: string) {
//   const { leaderboardRepository } = useGnoswapContext();
//
//   const query = useQuery<GetMyLeaderResponse>({
//     queryKey: QUERY_KEY.leader(address),
//     queryFn: () => leaderboardRepository.getMyLeader({ address }),
//     suspense: true,
//   });
//   return query;
// }
