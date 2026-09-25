import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { GetMyDelegationRequest, MyDelegationInfo } from "@repositories/governance";

import { QUERY_KEY } from "../query-keys";

const REFETCH_INTERVAL = 60_000;

export const useGetMyDelegation = (
  request: GetMyDelegationRequest,
  options?: UseQueryOptions<MyDelegationInfo, Error>,
) => {
  const { governanceRepository } = useGnoswapContext();
  const { currentChainId } = useWallet();

  // Keyed by chain and address without keepPreviousData, so another account's
  // summary is never served while the current account's data is loading.
  return useQuery<MyDelegationInfo, Error>({
    queryKey: [QUERY_KEY.governanceMyDelegation, currentChainId, request.address],
    queryFn: () => {
      return governanceRepository.getMyDelegation(request);
    },
    refetchInterval: REFETCH_INTERVAL,
    refetchOnMount: true,
    refetchOnReconnect: true,
    enabled: !!request.address,
    ...options,
  });
};
