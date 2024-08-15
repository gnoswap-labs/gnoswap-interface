import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";

import { QUERY_KEY } from "../query-keys";

export const useGetTokenBalancesFromChain = (
  chainId: string,
  address: string | undefined,
  key: string,
  options?: UseQueryOptions<number | null, Error>,
) => {
  const { accountRepository } = useGnoswapContext();

  return useQuery<number | null, Error>({
    queryKey: [QUERY_KEY.accountGnotTokenBalance, chainId, address || "", key],
    queryFn: () => accountRepository.getBalanceByKey(address || "", key),
    ...options,
  });
};
