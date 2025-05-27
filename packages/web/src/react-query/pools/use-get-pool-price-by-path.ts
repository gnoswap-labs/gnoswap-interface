import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";

import { QUERY_KEY } from "@query/query-keys";
import { CHART_DAY_SCOPE_TYPE } from "@constants/option.constant";
import { PoolPricesResponse } from "@repositories/pool";

export const useGetPoolPriceByPath = (
  path: string,
  period?: CHART_DAY_SCOPE_TYPE,
  options?: UseQueryOptions<PoolPricesResponse, Error>,
) => {
  const { poolRepository } = useGnoswapContext();
  return useQuery<PoolPricesResponse, Error>({
    queryKey: [QUERY_KEY.prices, path, period],
    queryFn: async () => {
      return poolRepository.getPoolPriceByPoolPath(path, period);
    },
    refetchOnMount: true,
    refetchOnReconnect: true,
    ...options,
  });
};
