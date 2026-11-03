import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { PositionSummaryResponse } from "@repositories/position/response";

import { QUERY_KEY } from "../query-keys";

const REFETCH_INTERVAL = 60_000;

export const useGetPositionSummary = (
  props?: { address?: string; poolPath?: string },
  options?: UseQueryOptions<PositionSummaryResponse | null, Error>,
) => {
  const { positionRepository } = useGnoswapContext();
  const { account, currentChainId, availNetwork } = useWallet();
  const address = props?.address ?? account?.address ?? "";
  const poolPath = props?.poolPath ?? "";

  return useQuery<PositionSummaryResponse | null, Error>({
    queryKey: [QUERY_KEY.positionSummary, currentChainId, address, poolPath],
    queryFn: async () => {
      if (!availNetwork || !address) {
        return null;
      }

      return positionRepository.getPositionSummaryByAddress(address, poolPath || undefined);
    },
    keepPreviousData: false,
    refetchInterval: REFETCH_INTERVAL,
    refetchOnMount: true,
    refetchOnReconnect: true,
    ...options,
  });
};
