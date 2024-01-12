import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { QUERY_KEY } from "./types";
import { PositionModel } from "@models/position/position-model";

export const useGetPositionsByAddress = (
  address: string,
  options?: UseQueryOptions<PositionModel[], Error>
) => {
  const { positionRepository } = useGnoswapContext();

  return useQuery<PositionModel[], Error>({
    queryKey: [QUERY_KEY.positions, address],
    queryFn: async () => {
      const data = await positionRepository.getPositionsByAddress(address);
      return data;
    },
    ...options,
    refetchOnMount: true,
    refetchOnReconnect: true,
    retry: false,
  });
};
