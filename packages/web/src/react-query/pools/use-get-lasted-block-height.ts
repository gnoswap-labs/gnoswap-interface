import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";

import { QUERY_KEY } from "../query-keys";

export const useGetLastedBlockHeight = (
  options?: UseQueryOptions<string, Error>,
) => {
  const { poolRepository } = useGnoswapContext();

  return useQuery<string, Error>({
    queryKey: [QUERY_KEY.lastedBlockHeight],
    queryFn: async () => {
      const data = await poolRepository.getLatestBlockHeight();

      return data;
    },
    ...options,
  });
};
