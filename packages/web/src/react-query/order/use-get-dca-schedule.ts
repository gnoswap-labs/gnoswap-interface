import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { GetDcaScheduleRequest } from "@repositories/order/request";
import { DcaScheduleResponse } from "@repositories/order/response";

import { QUERY_KEY } from "../query-keys";

export const useGetDcaSchedule = (
  request: GetDcaScheduleRequest | null,
  options?: UseQueryOptions<DcaScheduleResponse, Error>,
) => {
  const { orderRepository } = useGnoswapContext();

  return useQuery<DcaScheduleResponse, Error>({
    queryKey: [
      QUERY_KEY.dcaSchedule,
      request?.inputToken,
      request?.outputToken,
      request?.interval,
      request?.executionCount,
    ],
    queryFn: () => orderRepository.getDcaSchedule(request!),
    enabled: !!request?.inputToken && !!request?.outputToken && !!request?.interval && !!request?.executionCount,
    keepPreviousData: true,
    ...options,
  });
};
