import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { GetMyDeligationRequest, MyDelegationInfo } from "@repositories/governance";

import { QUERY_KEY } from "../query-keys";

const REFETCH_INTERVAL = 10_000;

export const useGetMyDelegation = (
  request: GetMyDeligationRequest,
  options?: UseQueryOptions<MyDelegationInfo, Error>,
) => {
  const { governanceRepository } = useGnoswapContext();

  return useQuery<MyDelegationInfo, Error>({
    queryKey: [QUERY_KEY.governanceMyDelegation, request.address],
    queryFn: () => {
      return governanceRepository.getMyDeligation(request);
    },
    refetchInterval: REFETCH_INTERVAL,
    refetchOnMount: true,
    refetchOnReconnect: true,
    ...options,
  });
};
