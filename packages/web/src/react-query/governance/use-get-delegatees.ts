import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { DelegateeInfo } from "@repositories/governance";

import { QUERY_KEY } from "../query-keys";

const REFETCH_INTERVAL = 10_000;

export const useGetDelegatees = (
  options?: UseQueryOptions<DelegateeInfo[], Error>,
) => {
  const { governanceRepository } = useGnoswapContext();

  return useQuery<DelegateeInfo[], Error>({
    queryKey: [QUERY_KEY.governanceDelegatees],
    queryFn: governanceRepository.getDelegatees,
    refetchInterval: REFETCH_INTERVAL,
    refetchOnMount: true,
    refetchOnReconnect: true,
    ...options,
  });
};
