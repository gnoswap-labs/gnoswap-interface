import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";

import { QUERY_KEY } from "../query-keys";

export const useGetTokenBalancesFromChain = (
  chainId: string,
  address: string | undefined,
  key: string,
  option?: UseQueryOptions<number | null>,
) => {
  const { accountRepository } = useGnoswapContext();

  return useQuery({
    queryKey: [QUERY_KEY.accountGnotTokenBalance, chainId, address || "", key],
    queryFn: () => accountRepository.getBalanceByKey(address || "", key),
    refetchInterval: 5_000,
    refetchOnMount: "always",
    ...option,
  });
};
