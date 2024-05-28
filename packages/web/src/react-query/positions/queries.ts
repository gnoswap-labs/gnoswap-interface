import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { QUERY_KEY } from "./types";
import { PositionModel } from "@models/position/position-model";
import { IPositionHistoryModel } from "@models/position/position-history-model";
import { PositionBinModel } from "@models/position/position-bin-model";

export const useGetPositionsByAddress = (
  address: string,
  options?: UseQueryOptions<PositionModel[], Error>,
) => {
  const { positionRepository } = useGnoswapContext();

  return useQuery<PositionModel[], Error>({
    queryKey: [QUERY_KEY.positions, address],
    queryFn: async () => {
      const data = await positionRepository.getPositionsByAddress(address);
      return data;
    },
    ...options,
    // refetchOnMount: true,
    // refetchOnReconnect: true,
    // retry: false,
  });
};

export const useGetPositionHistory = (
  lpTokenId: string,
  options?: UseQueryOptions<IPositionHistoryModel[], Error>,
) => {
  const { positionRepository } = useGnoswapContext();

  return useQuery<IPositionHistoryModel[], Error>({
    queryKey: [QUERY_KEY.positions, "history", lpTokenId],
    queryFn: async () => {
      const data = await positionRepository.getPositionHistory(lpTokenId);
      return data;
    },
    ...options,
  });
};

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
    ...options,
  });
};

export const useGetLazyPositionBins = (
  lpTokenId: string,
  count: 20 | 40,
  enabled = true,
  options?: UseQueryOptions<PositionBinModel[], Error>,
) => {
  const { positionRepository } = useGnoswapContext();

  return useQuery<PositionBinModel[], Error>({
    queryKey: [QUERY_KEY.positionLazyBins, lpTokenId, count],
    queryFn: async () => {
      const data = await positionRepository.getPositionBins(lpTokenId, count);
      return data;
    },
    ...options,
    enabled: enabled,
  });
};