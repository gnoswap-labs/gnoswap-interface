import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { mapDcaExecutionToHistory } from "@models/order/mapper/order-mapper";
import { OrderHistoryModel } from "@models/order/order-type";
import { TokenModel } from "@models/token/token-model";
import { OrderPagedResponse } from "@repositories/order/response";

import { QUERY_KEY } from "../query-keys";

const REFETCH_INTERVAL = 10_000;

export const useGetDcaExecutions = (
  request: { orderId: string; page: number; size?: number; inputToken: TokenModel; outputToken: TokenModel },
  options?: UseQueryOptions<OrderPagedResponse<OrderHistoryModel>, Error>,
) => {
  const { orderRepository } = useGnoswapContext();
  const { orderId, page, size, inputToken, outputToken } = request;

  return useQuery<OrderPagedResponse<OrderHistoryModel>, Error>({
    queryKey: [QUERY_KEY.dcaExecutions, orderId, page, size],
    queryFn: async () => {
      const response = await orderRepository.getDcaExecutions({ orderId, page, size });
      return {
        ...response,
        items: response.items.map(item => mapDcaExecutionToHistory(item, inputToken, outputToken)),
      };
    },
    refetchInterval: REFETCH_INTERVAL,
    keepPreviousData: true,
    ...options,
  });
};
