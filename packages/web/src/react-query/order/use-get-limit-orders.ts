import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { LimitOrderModel } from "@models/order/limit-order-model";
import { mapLimitOrderItemToModel } from "@models/order/mapper/order-mapper";
import { useGetTokens } from "@query/token";
import { GetOrdersRequest } from "@repositories/order/request";
import { OrderPagedResponse } from "@repositories/order/response";

import { QUERY_KEY } from "../query-keys";
import { ORDER_LIST_REFETCH_INTERVAL } from "./use-get-dca-orders";

export const useGetLimitOrders = (
  request: GetOrdersRequest,
  options?: UseQueryOptions<OrderPagedResponse<LimitOrderModel>, Error>,
) => {
  const { orderRepository } = useGnoswapContext();
  // Amounts are scaled by token decimals, so wait for the token list instead of guessing them.
  const { data: tokenData } = useGetTokens(true);
  const tokens = tokenData?.tokens ?? [];

  return useQuery<OrderPagedResponse<LimitOrderModel>, Error>({
    queryKey: [QUERY_KEY.limitOrders, request.address, request.status, request.page, request.size, tokens.length],
    queryFn: async () => {
      const response = await orderRepository.getLimitOrders(request);
      return {
        ...response,
        items: response.items.map(item => mapLimitOrderItemToModel(item, tokens)),
      };
    },
    refetchInterval: ORDER_LIST_REFETCH_INTERVAL,
    keepPreviousData: true,
    ...options,
    enabled: !!request.address && !!tokenData && (options?.enabled ?? true),
  });
};
