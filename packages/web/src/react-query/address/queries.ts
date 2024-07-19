import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { QUERY_KEY } from "./types";
import { formatAddress } from "@utils/string-utils";
import { WalletState } from "@states/index";
import { useAtom } from "jotai";

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
  address: string,
  tokenKey: string,
) => [QUERY_KEY.accountGnotTokenBalance, address, tokenKey];

export const useGetTokenBalancesFromChain = (
  key: string,
  option?: UseQueryOptions<number | null>,
) => {
  const { accountRepository } = useGnoswapContext();
  const [walletAccount] = useAtom(WalletState.account);

  return useQuery({
    queryKey: [QUERY_KEY.accountGnotTokenBalance, walletAccount?.address, key],
    queryFn: () =>
      accountRepository.getBalanceByKey(walletAccount?.address || "", key),
    refetchInterval: 5_000,
    refetchOnMount: "always",
    enabled: !!walletAccount,
    ...option,
  });
};
