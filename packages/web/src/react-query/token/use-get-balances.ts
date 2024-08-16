import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";

import { QUERY_KEY } from "../query-keys";
import { IBalancesByAddressResponse } from "@repositories/token/response/balance-by-address-response";
import { AccountError } from "@common/errors/account";

export const useGetBalances = (
  address: string | null,
  options?: UseQueryOptions<IBalancesByAddressResponse, Error>,
) => {
  const { tokenRepository } = useGnoswapContext();

  return useQuery<IBalancesByAddressResponse, Error>({
    queryKey: [QUERY_KEY.tokenBalancesByAddress, address || ""],
    queryFn: () => {
      if (!address) {
        throw new AccountError("NOT_FOUNT_ADDRESS");
      }
      return tokenRepository.getBalancesByAddress(address);
    },
    ...options,
  });
};
