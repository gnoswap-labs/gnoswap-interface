import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";

import { QUERY_KEY } from "../query-keys";

export const useGetPoolCreationFee = (
  options?: UseQueryOptions<number, Error>,
) => {
  const { poolRepository } = useGnoswapContext();

  return useQuery<number, Error>({
    queryKey: [QUERY_KEY.poolCreationFee],
    queryFn: async () => {
      const res = await poolRepository.getCreationFee();

      return res;
    },
    ...options,
  });
};
