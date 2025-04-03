import { useEffect, useRef } from "react";

export const refetchingOptions = {
  staleTime: 0,
  enabled: true,
  refetchOnMount: true,
  refetchOnReconnect: true,
  refetchOnWindowFocus: true,
};

export function useNextUpdateTime() {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // const query = useQuery({
  //   queryKey: [QUERY_KEY.leaderboard],
  //   queryFn: () => leaderboardRepository.getNextUpdateTime({}),

  //   ...refetchingOptions,

  //   onSuccess: data => {
  //     if (timeoutRef.current) clearTimeout(timeoutRef.current);

  //     timeoutRef.current = setTimeout(() => {
  //       queryClient.refetchQueries([QUERY_KEY.leaderboard]);
  //     }, getTimeDiffInMilliseconds(data.nextUpdateTime));
  //   },
  // });

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [timeoutRef]);

  // return query;
}
