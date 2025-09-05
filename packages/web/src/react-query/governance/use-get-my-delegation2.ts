import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { GetMyDelegationRequest, MyDelegationInfo2 } from "@repositories/governance";

import { QUERY_KEY } from "../query-keys";

const REFETCH_INTERVAL = 60_000;

export const useGetMyDelegation2 = (
  request: GetMyDelegationRequest,
  options?: UseQueryOptions<MyDelegationInfo2, Error>,
) => {
  const { governanceRepository } = useGnoswapContext();

  return useQuery<MyDelegationInfo2, Error>({
    queryKey: [QUERY_KEY.governanceMyDelegation, request.address],
    queryFn: () => {
      return governanceRepository.getMyDelegation2(request);
    },
    refetchInterval: REFETCH_INTERVAL,
    refetchOnMount: true,
    refetchOnReconnect: true,
    keepPreviousData: true,
    enabled: !!request.address,
    ...options,
  });
};
