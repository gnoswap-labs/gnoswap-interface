import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { QUERY_KEY } from "@query/query-keys";

const REFETCH_INTERVAL = 5_000;

export const useGetGasPrice = (options?: UseQueryOptions<number | null, Error>): UseQueryResult<number | null> => {
  const { transactionGasService } = useGnoswapContext();

  return useQuery<number | null, Error>({
    queryKey: [QUERY_KEY.gasPrice, transactionGasService],
    queryFn: () => {
      if (!transactionGasService) return null;

      return transactionGasService.getGasPrices();
    },
    enabled: !!transactionGasService,
    refetchInterval: REFETCH_INTERVAL,
    keepPreviousData: true,
    ...options,
  });
};
