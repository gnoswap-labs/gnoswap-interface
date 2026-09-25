import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { GetMyUnDelegatesRequest, MyUnDelegatesInfo } from "@repositories/governance";

import { QUERY_KEY } from "../query-keys";

const REFETCH_INTERVAL = 60_000;

export const useGetMyUnDelegates = (
  request: GetMyUnDelegatesRequest,
  options?: UseQueryOptions<MyUnDelegatesInfo, Error>,
) => {
  const { governanceRepository } = useGnoswapContext();
  const { currentChainId } = useWallet();

  return useQuery<MyUnDelegatesInfo, Error>({
    queryKey: [QUERY_KEY.governanceMyUnDelegates, currentChainId, request.address],
    queryFn: () => {
      return governanceRepository.getMyUnDelegates(request);
    },
    refetchInterval: REFETCH_INTERVAL,
    refetchOnMount: true,
    refetchOnReconnect: true,
    enabled: !!request.address,
    ...options,
  });
};
