import { useInfiniteQuery, UseInfiniteQueryOptions } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { GetProposalsReqeust2, Proposals2Info } from "@repositories/governance";

import { QUERY_KEY } from "@query/query-keys";

const REFETCH_INTERVAL = 60_000;

export const useGetProposals2 = (
  request: Omit<GetProposalsReqeust2, "page">,
  options?: UseInfiniteQueryOptions<Proposals2Info, Error>,
) => {
  const { governanceRepository } = useGnoswapContext();

  return useInfiniteQuery<Proposals2Info, Error>({
    queryKey: [QUERY_KEY.governanceProposals, request.isActive, request.address, request.size],
    queryFn: ({ pageParam = 1 }) => {
      return governanceRepository.getProposals2({
        ...request,
        page: pageParam,
      });
    },
    getNextPageParam: lastPage => {
      if (lastPage.pageInfo.totalPages <= lastPage.pageInfo.currentPage) return null;
      return lastPage.pageInfo.currentPage + 1;
    },
    refetchInterval: REFETCH_INTERVAL,
    refetchOnMount: true,
    refetchOnReconnect: true,
    ...options,
  });
};
