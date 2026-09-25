import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { GetMyDelegatesRequest, MyDelegatesInfo } from "@repositories/governance";

import { QUERY_KEY } from "../query-keys";

const REFETCH_INTERVAL = 60_000;

export const useGetMyDelegates = (
  request: GetMyDelegatesRequest,
  options?: UseQueryOptions<MyDelegatesInfo, Error>,
) => {
  const { governanceRepository } = useGnoswapContext();
  const { currentChainId } = useWallet();

  return useQuery<MyDelegatesInfo, Error>({
    queryKey: [QUERY_KEY.governanceMyDelegates, currentChainId, request.address],
    queryFn: () => {
      return governanceRepository.getMyDelegates(request);
    },
    refetchInterval: REFETCH_INTERVAL,
    refetchOnMount: true,
    refetchOnReconnect: true,
    enabled: !!request.address,
    ...options,
  });
};
