import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useMemo } from "react";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { PositionRewardsResponse } from "@repositories/position/response";

import { QUERY_KEY } from "../query-keys";

const REFETCH_INTERVAL = 60_000;

interface UseGetPositionRewardsProps {
  address?: string;
}

export const useGetPositionRewards = (
  props?: UseGetPositionRewardsProps,
  options?: UseQueryOptions<PositionRewardsResponse | null, Error>,
) => {
  const { positionRepository } = useGnoswapContext();
  const { account, currentChainId, availNetwork } = useWallet();

  const address = useMemo(() => {
    return props?.address || account?.address || "";
  }, [account?.address, props?.address]);

  return useQuery<PositionRewardsResponse | null, Error>({
    queryKey: [QUERY_KEY.positionRewards, currentChainId, address],
    queryFn: async () => {
      if (!availNetwork || !address) {
        return null;
      }

      return await positionRepository.getPositionRewardsByAddress(address).catch(e => {
        console.error(e);
        return null;
      });
    },
    keepPreviousData: true,
    refetchInterval: REFETCH_INTERVAL,
    refetchOnMount: true,
    refetchOnReconnect: true,
    ...options,
  });
};
