import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";

import { QUERY_KEY } from "../query-keys";

export const useGetSwapFee = (options?: UseQueryOptions<number, Error>) => {
  const { swapRouterRepository } = useGnoswapContext();

  return useQuery<number, Error>({
    queryKey: [QUERY_KEY.swapFee],
    queryFn: async () => {
      const res = await swapRouterRepository.getSwapFee();

      return res;
    },
    ...options,
  });
};
