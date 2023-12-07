import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { PoolModel } from "@models/pool/pool-model";
import { QUERY_KEY } from "./types";

export const useGetPoolList = (
  options?: UseQueryOptions<PoolModel[], Error>
) => {
  const { poolRepository } = useGnoswapContext();

  return useQuery<PoolModel[], Error>({
    queryKey: [QUERY_KEY.pools],
    queryFn: () => poolRepository.getPools(),
    ...options,
  });
};
