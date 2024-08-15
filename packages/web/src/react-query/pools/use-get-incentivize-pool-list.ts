import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { IncentivizePoolModel, PoolModel } from "@models/pool/pool-model";

import { QUERY_KEY } from "../query-keys";

export const useGetIncentivizePoolList = (
  options?: UseQueryOptions<IncentivizePoolModel[], Error>,
) => {
  const { poolRepository } = useGnoswapContext();

  return useQuery<IncentivizePoolModel[], Error>({
    queryKey: [QUERY_KEY.incentivizePools],
    queryFn: async () => {
      const data = await poolRepository.getIncentivizePools();
      data.sort(
        (a: PoolModel, b: PoolModel) => -Number(a.price) + Number(b.price),
      );
      return data;
    },
    ...options,
  });
};
