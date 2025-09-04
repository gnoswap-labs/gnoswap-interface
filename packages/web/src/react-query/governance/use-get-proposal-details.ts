import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { GetProposalDetailsRequest, ProposalDetailsInfo } from "@repositories/governance";

// import { QUERY_KEY } from "../query-keys";

const REFETCH_INTERVAL = 60_000;

export const useGetProposalDetails = (
  request: GetProposalDetailsRequest,
  options?: UseQueryOptions<ProposalDetailsInfo, Error>,
) => {
  const { governanceRepository } = useGnoswapContext();

  return useQuery<ProposalDetailsInfo, Error>({
    queryKey: ["get-proposal-details", request.proposalId, request.address],
    queryFn: () => {
      return governanceRepository.getProposalDetails(request);
    },
    refetchInterval: REFETCH_INTERVAL,
    refetchOnMount: true,
    refetchOnReconnect: true,
    keepPreviousData: true,
    enabled: !!request.proposalId,
    ...options,
  });
};
