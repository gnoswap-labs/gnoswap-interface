import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { DcaOrderModel } from "@models/order/dca-order-model";
import { mapDcaOrderItemToModel } from "@models/order/mapper/order-mapper";
import { useGetTokens } from "@query/token";
import { GetOrdersRequest } from "@repositories/order/request";
import { OrderPagedResponse } from "@repositories/order/response";

import { QUERY_KEY } from "../query-keys";

export const ORDER_LIST_REFETCH_INTERVAL = 10_000;

export const useGetDcaOrders = (
  request: GetOrdersRequest,
  options?: UseQueryOptions<OrderPagedResponse<DcaOrderModel>, Error>,
) => {
  const { orderRepository } = useGnoswapContext();
  // Amounts are scaled by token decimals, so wait for the token list instead of guessing them.
  const { data: tokenData } = useGetTokens(true);
  const tokens = tokenData?.tokens ?? [];

  return useQuery<OrderPagedResponse<DcaOrderModel>, Error>({
    queryKey: [QUERY_KEY.dcaOrders, request.address, request.status, request.page, request.size, tokens.length],
    queryFn: async () => {
      const response = await orderRepository.getDcaOrders(request);
      return {
        ...response,
        items: response.items.map(item => mapDcaOrderItemToModel(item, tokens)),
      };
    },
    refetchInterval: ORDER_LIST_REFETCH_INTERVAL,
    keepPreviousData: true,
    ...options,
    enabled: !!request.address && !!tokenData && (options?.enabled ?? true),
  });
};
