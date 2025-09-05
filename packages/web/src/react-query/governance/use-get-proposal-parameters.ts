import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { ProposalParameterInfo } from "@repositories/governance";

// import { QUERY_KEY } from "../query-keys";

const REFETCH_INTERVAL = 60_000;

export const useGetProposalParameters = (options?: UseQueryOptions<ProposalParameterInfo, Error>) => {
  const { governanceRepository } = useGnoswapContext();

  return useQuery<ProposalParameterInfo, Error>({
    queryKey: ["get-proposal-parameters"],
    queryFn: () => {
      return governanceRepository.getProposalParameters();
    },
    refetchInterval: REFETCH_INTERVAL,
    refetchOnMount: true,
    refetchOnReconnect: true,
    keepPreviousData: true,
    ...options,
  });
};
