import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { GetDcaPairRequest } from "@repositories/order/request";
import { DcaPairResponse } from "@repositories/order/response";

import { QUERY_KEY } from "../query-keys";

const STALE_TIME = 60_000;

/** The DCA settings of one swap direction; disabled until both tokens are set and differ. */
export const useGetDcaPair = (request: GetDcaPairRequest | null, options?: UseQueryOptions<DcaPairResponse, Error>) => {
  const { orderRepository } = useGnoswapContext();

  return useQuery<DcaPairResponse, Error>({
    queryKey: [QUERY_KEY.dcaPair, request?.inputToken, request?.outputToken],
    queryFn: () => orderRepository.getDcaPair(request!),
    enabled: !!request?.inputToken && !!request?.outputToken && request.inputToken !== request.outputToken,
    staleTime: STALE_TIME,
    ...options,
  });
};
