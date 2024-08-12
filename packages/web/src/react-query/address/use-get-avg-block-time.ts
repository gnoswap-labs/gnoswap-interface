import { useQuery } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";

import { QUERY_KEY } from "../query-keys";

export const useGetAvgBlockTime = (startBlock?: number) => {
  const { accountRepository } = useGnoswapContext();

  return useQuery({
    queryKey: [QUERY_KEY.avgBlockTime],
    queryFn: () => accountRepository.getAvgBlockTime({ startBlock }),
  });
};