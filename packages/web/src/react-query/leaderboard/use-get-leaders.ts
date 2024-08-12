import { useQuery } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { LeaderModel } from "@models/leaderboard/leader-model";
import {
  GetLeadersResponse
} from "@repositories/leaderboard/response";
import { Leader } from "@repositories/leaderboard/response/common/types";
import { formatAddress, numberToFormat } from "@utils/string-utils";

import { QUERY_KEY } from "../query-keys";

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

export function useGetLeaders(page: number, size: number) {
  const { leaderboardRepository } = useGnoswapContext();

  const results = useQuery({
    queryKey: [QUERY_KEY.leaderboardLeaders, page],
    queryFn: () => leaderboardRepository.getLeaders({ page, size }),

    select: (data: GetLeadersResponse) => ({
      ...data,
      leaders: data.leaders.map(mapLeader),
    }),

    keepPreviousData: true,

    suspense: true,

    ...refetchingOptions,
  });

  return results;
}