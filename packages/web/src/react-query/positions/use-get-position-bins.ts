import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";

import { QUERY_KEY } from "../query-keys";
import { PositionBinModel } from "@models/position/position-bin-model";

export const useGetPositionBins = (
  lpTokenId: string,
  count: 20 | 40,
  options?: UseQueryOptions<PositionBinModel[], Error>,
) => {
  const { positionRepository } = useGnoswapContext();

  return useQuery<PositionBinModel[], Error>({
    queryKey: [QUERY_KEY.positionBins, lpTokenId, count],
    queryFn: async () => {
      const data = await positionRepository.getPositionBins(lpTokenId, count);
      return data;
    },
    refetchOnMount: true,
    refetchOnReconnect: true,
    ...options,
  });
};
