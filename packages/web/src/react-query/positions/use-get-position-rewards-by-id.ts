import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { PositionRewardsResponse } from "@repositories/position/response";

import { QUERY_KEY } from "../query-keys";

interface UseGetPositionRewardsByIdProps {
  address: string;
  positionId: string;
}

export const useGetPositionRewardsById = (
  { address, positionId }: UseGetPositionRewardsByIdProps,
  options?: UseQueryOptions<PositionRewardsResponse, Error>,
) => {
  const { positionRepository } = useGnoswapContext();
  const { currentChainId, availNetwork } = useWallet();

  return useQuery<PositionRewardsResponse, Error>({
    staleTime: 5 * 60_000,
    refetchOnReconnect: true,
    ...options,
    // Share the address prefix so existing claim/remove invalidations refresh every position too.
    queryKey: [QUERY_KEY.positionRewards, currentChainId, address, "position", positionId],
    queryFn: () => positionRepository.getPositionRewardsByAddressAndId(address, positionId),
    enabled: availNetwork && !!address && !!positionId && options?.enabled !== false,
    keepPreviousData: false,
  });
};
