import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { formatAddress } from "@utils/string-utils";

import { QUERY_KEY } from "../query-keys";

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
  });
};
