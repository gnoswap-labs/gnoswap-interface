import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { GetProposalsReqeust, ProposalsInfo } from "@repositories/governance";

import { QUERY_KEY } from "../query-keys";

export const useGetProposals = (
  request: Omit<GetProposalsReqeust, "offset">,
  options?: UseInfiniteQueryOptions<ProposalsInfo, Error>,
) => {
  const { governanceRepository } = useGnoswapContext();

  return useInfiniteQuery<ProposalsInfo, Error>({
    queryKey: [
      QUERY_KEY.governanceProposals,
      request.isActive,
      request.address,
      request.limit,
    ],
    queryFn: ({ pageParam = 0 }) => {
      return governanceRepository.getProposals({
        ...request,
        offset: pageParam,
      });
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.pageInfo.totalPages <= lastPage.pageInfo.currentPage + 1)
        return null;
      return lastPage.pageInfo.currentPage + 1;
    },
    refetchOnMount: true,
    refetchOnReconnect: true,
    ...options,
  });
};
