import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { GetProposalsReqeust, ProposalsInfo } from "@repositories/governance";

import { QUERY_KEY } from "../query-keys";

const REFETCH_INTERVAL = 100_000;

export const useGetProposals = (
  request: GetProposalsReqeust,
  options?: UseQueryOptions<ProposalsInfo, Error>,
) => {
  const { governanceRepository } = useGnoswapContext();

  return useQuery<ProposalsInfo, Error>({
    queryKey: [
      QUERY_KEY.governanceProposals,
      request.isActive,
      request.offset,
      request.address,
      request.limit,
    ],
    queryFn: () => {
      return governanceRepository.getProposals(request);
    },
    refetchInterval: REFETCH_INTERVAL,
    refetchOnMount: true,
    refetchOnReconnect: true,
    ...options,
  });
};
