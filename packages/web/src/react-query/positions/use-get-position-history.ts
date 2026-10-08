import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";

import { QUERY_KEY } from "../query-keys";
import { GetPositionHistoryResult } from "@repositories/position/response";

export const useGetPositionHistory = (
  lpTokenId: string,
  page = 1,
  limit = 30,
  options?: Omit<UseQueryOptions<GetPositionHistoryResult, Error>, "queryKey" | "queryFn">,
) => {
  const { positionRepository } = useGnoswapContext();

  return useQuery<GetPositionHistoryResult, Error>({
    queryKey: [QUERY_KEY.positionHistory, lpTokenId, page, limit],
    queryFn: () => positionRepository.getPositionHistory(lpTokenId, page, limit),
    keepPreviousData: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    ...options,
  });
};
