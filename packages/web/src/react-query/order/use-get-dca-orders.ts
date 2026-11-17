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
  const { data: { tokens = [] } = {} } = useGetTokens(true);

  return useQuery<OrderPagedResponse<DcaOrderModel>, Error>({
    queryKey: [QUERY_KEY.dcaOrders, request.address, request.status, request.page, request.size, tokens.length],
    queryFn: async () => {
      const response = await orderRepository.getDcaOrders(request);
      return {
        ...response,
        items: response.items.map(item => mapDcaOrderItemToModel(item, tokens)),
      };
    },
    enabled: !!request.address,
    refetchInterval: ORDER_LIST_REFETCH_INTERVAL,
    keepPreviousData: true,
    ...options,
  });
};
