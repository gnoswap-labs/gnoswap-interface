import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { QUERY_KEY } from "./types";
import { useAtomValue } from "jotai";
import { WalletState } from "@states/index";
import { getTimeDiffInMilliseconds } from "@common/utils/date-util";
import { useEffect, useRef } from "react";

export function useLeaders(page: number) {
  const account = useAtomValue(WalletState.account);
  const { leaderboardRepository } = useGnoswapContext();

  const results = useQueries({
    queries: [
      {
        queryKey: QUERY_KEY.leaders(page),
        queryFn: () => leaderboardRepository.getLeaders({ page }),
        keepPreviousData: true,
        suspense: true,

        staleTime: 0,
        enabled: true,
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
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

        staleTime: 0,
        enabled: true,
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
      },
    ],
  });

  return results;
}

export function useNextUpdateTime() {
  const queryClient = useQueryClient();
  const { leaderboardRepository } = useGnoswapContext();

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const query = useQuery({
    queryKey: QUERY_KEY.nextUpdateTime(),
    queryFn: () => leaderboardRepository.getNextUpdateTime({}),

    staleTime: 0,
    enabled: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,

    onSuccess: data => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        queryClient.refetchQueries(QUERY_KEY.default());
      }, getTimeDiffInMilliseconds(data.nextUpdateTime));
    },
  });

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [timeoutRef]);

  return query;
}
