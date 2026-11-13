import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { LimitConfigResponse } from "@repositories/order/response";

import { QUERY_KEY } from "../query-keys";

const STALE_TIME = 60_000;

export const useGetLimitConfig = (options?: UseQueryOptions<LimitConfigResponse, Error>) => {
  const { orderRepository } = useGnoswapContext();

  return useQuery<LimitConfigResponse, Error>({
    queryKey: [QUERY_KEY.limitConfig],
    queryFn: () => orderRepository.getLimitConfig(),
    staleTime: STALE_TIME,
    refetchInterval: STALE_TIME,
    ...options,
  });
};
