import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { DcaConfigResponse } from "@repositories/order/response";

import { QUERY_KEY } from "../query-keys";

const STALE_TIME = 5 * 60_000;

export const useGetDcaConfig = (options?: UseQueryOptions<DcaConfigResponse, Error>) => {
  const { orderRepository } = useGnoswapContext();

  return useQuery<DcaConfigResponse, Error>({
    queryKey: [QUERY_KEY.dcaConfig],
    queryFn: () => orderRepository.getDcaConfig(),
    staleTime: STALE_TIME,
    ...options,
  });
};
