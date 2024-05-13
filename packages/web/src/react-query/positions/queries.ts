import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { QUERY_KEY } from "./types";
import { PositionModel } from "@models/position/position-model";
import { IPositionHistoryModel } from "@models/position/position-history-model";

export const useGetPositionsByAddress = (
  address: string,
  options?: UseQueryOptions<PositionModel[], Error>
) => {
  const { positionRepository } = useGnoswapContext();

  return useQuery<PositionModel[], Error>({
    queryKey: [QUERY_KEY.positions, address],
    queryFn: async () => {
      const data = await positionRepository.getPositionsByAddress(address);
      console.log("🚀 ~ queryFn: ~ data:", data);
      return data;
    },
    ...options,
    // refetchOnMount: true,
    // refetchOnReconnect: true,
    // retry: false,
  });
};

export const useGetPositionHistory = (lpTokenId: string, options?: UseQueryOptions<IPositionHistoryModel[], Error>) => {
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