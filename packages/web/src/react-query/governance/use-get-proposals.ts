import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { GetProposalsReqeust, ProposalsInfo } from "@repositories/governance";

import { QUERY_KEY } from "../query-keys";

export const useGetProposals = (
  request: Omit<GetProposalsReqeust, "page">,
  options?: UseInfiniteQueryOptions<ProposalsInfo, Error>,
) => {
  const { governanceRepository } = useGnoswapContext();

  return useInfiniteQuery<ProposalsInfo, Error>({
    queryKey: [
      QUERY_KEY.governanceProposals,
      request.isActive,
      request.address,
      request.itemsPerPage,
    ],
    queryFn: ({ pageParam = 1 }) => {
      return governanceRepository.getProposals({
        ...request,
        page: pageParam,
      });
    },
    getNextPageParam: lastPage => {
      if (lastPage.pageInfo.totalPages <= lastPage.pageInfo.currentPage)
        return null;
      return lastPage.pageInfo.currentPage + 1;
    },
    refetchOnMount: true,
    refetchOnReconnect: true,
    ...options,
  });
};
