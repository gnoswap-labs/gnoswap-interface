import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";

import { QUERY_KEY } from "../query-keys";

export const useGetUnstakingFee = (
  options?: UseQueryOptions<number, Error>,
) => {
  const { poolRepository } = useGnoswapContext();

  return useQuery<number, Error>({
    queryKey: [QUERY_KEY.unstakingFee],
    queryFn: async () => {
      const res = await poolRepository.getUnstakingFee();

      return res;
    },
    ...options,
  });
};
