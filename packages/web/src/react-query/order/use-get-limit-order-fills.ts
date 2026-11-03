import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { mapLimitFillToHistory } from "@models/order/mapper/order-mapper";
import { OrderHistoryModel } from "@models/order/order-type";
import { TokenModel } from "@models/token/token-model";
import { OrderPagedResponse } from "@repositories/order/response";

import { QUERY_KEY } from "../query-keys";

const REFETCH_INTERVAL = 10_000;

export const useGetLimitOrderFills = (
  request: { orderId: string; page: number; size?: number; tokenIn: TokenModel; tokenOut: TokenModel },
  options?: UseQueryOptions<OrderPagedResponse<OrderHistoryModel>, Error>,
) => {
  const { orderRepository } = useGnoswapContext();
  const { orderId, page, size, tokenIn, tokenOut } = request;

  return useQuery<OrderPagedResponse<OrderHistoryModel>, Error>({
    queryKey: [QUERY_KEY.limitOrderFills, orderId, page, size],
    queryFn: async () => {
      const response = await orderRepository.getLimitOrderFills({ orderId, page, size });
      return {
        ...response,
        items: response.items.map((item, index) => mapLimitFillToHistory(item, tokenIn, tokenOut, index)),
      };
    },
    refetchInterval: REFETCH_INTERVAL,
    keepPreviousData: true,
    ...options,
  });
};
