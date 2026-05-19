import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { GNS_DEPOSIT_AMOUNT } from "@common/values";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";

import { QUERY_KEY } from "../query-keys";

export const DEFAULT_INCENTIVE_CREATION_DEPOSIT_GNS_AMOUNT = String(GNS_DEPOSIT_AMOUNT);

export const useGetIncentiveCreationDeposit = (options?: UseQueryOptions<string, Error>) => {
  const { poolRepository } = useGnoswapContext();

  return useQuery<string, Error>({
    queryKey: [QUERY_KEY.incentiveCreationDeposit],
    queryFn: async () => {
      const res = await poolRepository.getIncentiveCreationDeposit();

      return res;
    },
    placeholderData: DEFAULT_INCENTIVE_CREATION_DEPOSIT_GNS_AMOUNT,
    ...options,
  });
};
