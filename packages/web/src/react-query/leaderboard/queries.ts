import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { QUERY_KEY } from "./types";
import { useAtomValue } from "jotai";
import { WalletState } from "@states/index";
import { getTimeDiffInMilliseconds } from "@common/utils/date-util";
import { useEffect, useRef } from "react";
import {
  GetLeaderByAddressResponse,
  GetLeadersResponse,
} from "@repositories/leaderboard/response";
import { formatAddress, numberToFormat } from "@utils/string-utils";
import { Leader } from "@repositories/leaderboard/response/common/types";
import { LeaderModel } from "@models/leaderboard/leader-model";

const mapLeader = (v: Leader): LeaderModel => ({
  rank: v.rank,
  hide: v.hide,
  address: v.address,

  formattedAddress: formatAddress(v.address, 8),
  mobileSpecificFormattedAddress: formatAddress(v.address, 4),

  swapVolume: `$${numberToFormat(v.swapVolume)}`,
  positionValue: `$${numberToFormat(v.positionValue)}`,
  stakingValue: `$${numberToFormat(v.stakingValue)}`,

  pointSum: `${numberToFormat(v.pointSum)}`,
  swapFeePoint: `${numberToFormat(v.swapFeePoint)}`,
  poolRewardPoint: `${numberToFormat(v.poolRewardPoint)}`,
  stakingRewardPoint: `${numberToFormat(v.stakingRewardPoint)}`,
  referralRewardPoint: `${numberToFormat(v.referralRewardPoint)}`,
});

const refetchingOptions = {
  staleTime: 0,
  enabled: true,
  refetchOnMount: true,
  refetchOnReconnect: true,
  refetchOnWindowFocus: true,
};

export function useLeaders(page: number) {
  const account = useAtomValue(WalletState.account);
  const { leaderboardRepository } = useGnoswapContext();

  const size = 100;
  const results = useQueries({
    queries: [
      {
        queryKey: QUERY_KEY.leaders(page),
        queryFn: () => leaderboardRepository.getLeaders({ page, size }),

        select: (data: GetLeadersResponse) => ({
          ...data,
          leaders: data.leaders.map(mapLeader),
        }),

        keepPreviousData: true,

        suspense: true,

        ...refetchingOptions,
      },
      {
        queryKey: QUERY_KEY.leader(account?.address),
        queryFn: () => {
          if (!account?.address) return null;

          return leaderboardRepository.getLeaderByAddress({
            address: account.address,
          });
        },

        select: (data: GetLeaderByAddressResponse | null) =>
          data === null ? null : { leader: mapLeader(data.leader) },

        suspense: true,

        ...refetchingOptions,
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

    ...refetchingOptions,

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
