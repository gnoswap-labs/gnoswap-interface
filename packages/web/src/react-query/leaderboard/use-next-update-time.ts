import { useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getTimeDiffInMilliseconds } from "@common/utils/date-util";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";

import { QUERY_KEY } from "../query-keys";

export const refetchingOptions = {
  staleTime: 0,
  enabled: true,
  refetchOnMount: true,
  refetchOnReconnect: true,
  refetchOnWindowFocus: true,
};

export function useNextUpdateTime() {
  const queryClient = useQueryClient();
  const { leaderboardRepository } = useGnoswapContext();

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const query = useQuery({
    queryKey: [QUERY_KEY.leaderboard],
    queryFn: () => leaderboardRepository.getNextUpdateTime({}),

    ...refetchingOptions,

    onSuccess: data => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        queryClient.refetchQueries([QUERY_KEY.leaderboard]);
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
