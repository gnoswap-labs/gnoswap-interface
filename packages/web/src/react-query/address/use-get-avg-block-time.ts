import { useQuery } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";

import { QUERY_KEY } from "../query-keys";
import { AvgBlockTime } from "@repositories/account/response/get-avg-block-time-response";

export const useGetAvgBlockTime = (startBlock?: number) => {
  const { accountRepository } = useGnoswapContext();

  return useQuery<AvgBlockTime, Error>({
    queryKey: [QUERY_KEY.avgBlockTime],
    queryFn: () => accountRepository.getAvgBlockTime({ startBlock }),
  });
};
