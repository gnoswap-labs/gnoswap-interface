import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";

import { QUERY_KEY } from "../query-keys";
import { IPositionHistoryModel } from "@models/position/position-history-model";

export const useGetPositionHistory = (
  lpTokenId: string,
  options?: UseQueryOptions<IPositionHistoryModel[], Error>,
) => {
  const { positionRepository } = useGnoswapContext();

  return useQuery<IPositionHistoryModel[], Error>({
    queryKey: [QUERY_KEY.positionHistory, lpTokenId],
    queryFn: () => positionRepository.getPositionHistory(lpTokenId),
    refetchOnMount: true,
    refetchOnReconnect: true,
    ...options,
  });
};
