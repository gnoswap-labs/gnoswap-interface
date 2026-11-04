import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { DcaOrderModel } from "@models/order/dca-order-model";
import { mapDcaOrderItemToModel } from "@models/order/mapper/order-mapper";
import { useGetTokens } from "@query/token";

import { QUERY_KEY } from "../query-keys";

export const useGetDcaOrder = (
  orderId: string | null,
  packagePath?: string,
  options?: UseQueryOptions<DcaOrderModel, Error>,
) => {
  const { orderRepository } = useGnoswapContext();
  const { data: { tokens = [] } = {} } = useGetTokens(true);

  return useQuery<DcaOrderModel, Error>({
    queryKey: [QUERY_KEY.dcaOrder, packagePath, orderId, tokens.length],
    queryFn: async () => mapDcaOrderItemToModel(await orderRepository.getDcaOrder(orderId!, packagePath), tokens),
    enabled: !!orderId,
    ...options,
  });
};
