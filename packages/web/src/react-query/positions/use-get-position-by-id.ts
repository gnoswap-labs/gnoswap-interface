import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { PositionModel } from "@models/position/position-model";

import { QUERY_KEY } from "../query-keys";

export const useGetPositionById = (
  lpTokenId: string,
  options?: UseQueryOptions<PositionModel, Error>,
) => {
  const { positionRepository } = useGnoswapContext();

  return useQuery<PositionModel, Error>({
    queryKey: [QUERY_KEY.positionDetail, lpTokenId],
    queryFn: async () => {
      const data = await positionRepository.getPositionById(lpTokenId);
      return data;
    },
    refetchOnMount: true,
    refetchOnReconnect: true,
    ...options,
  });
};
