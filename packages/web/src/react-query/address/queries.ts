import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { QUERY_KEY } from "./types";
import { formatAddress } from "@utils/string-utils";

export const useGetUsernameByAddress = (
  address: string,
  options?: UseQueryOptions<string, Error>,
) => {
  const { accountRepository } = useGnoswapContext();

  return useQuery<string, Error>({
    queryKey: [QUERY_KEY.username, address],
    queryFn: async () => {
      if (address === "") {
        return "";
      }
      const data = await accountRepository.getUsername(address).catch(() => "");
      if (data === "" || data === "nil") {
        return formatAddress(address);
      }
      return data;
    },
    ...options,
    refetchOnMount: true,
    refetchOnReconnect: true,
    retry: false,
  });
};

export const getAccountBalanceQueryKey = (
  chainId: string,
  address: string | undefined,
  tokenKey: string,
) => [QUERY_KEY.accountGnotTokenBalance, chainId, address, tokenKey];

export const useGetTokenBalancesFromChain = (
  chainId: string,
  address: string | undefined,
  key: string,
  option?: UseQueryOptions<number | null>,
) => {
  const { accountRepository } = useGnoswapContext();

  return useQuery({
    queryKey: [chainId, address || "", key],
    queryFn: () => accountRepository.getBalanceByKey(address || "", key),
    refetchInterval: 5_000,
    refetchOnMount: "always",
    ...option,
  });
};
