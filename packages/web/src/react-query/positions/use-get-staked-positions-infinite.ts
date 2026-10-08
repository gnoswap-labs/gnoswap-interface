import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { QUERY_KEY } from "../query-keys";

export const STAKED_POSITIONS_PAGE_SIZE = 20;

export const useGetStakedPositionsInfinite = (props?: { address?: string; poolPath?: string }) => {
  const { positionRepository } = useGnoswapContext();
  const { account, currentChainId, availNetwork } = useWallet();
  const address = props?.address ?? account?.address ?? "";
  const poolPath = props?.poolPath ?? "";
  const query = useInfiniteQuery({
    queryKey: [
      QUERY_KEY.positions,
      currentChainId,
      address,
      "staked-infinite",
      poolPath,
      true,
      false,
      STAKED_POSITIONS_PAGE_SIZE,
    ],
    queryFn: ({ pageParam = 1 }) =>
      positionRepository.getPositionsByAddress(address, {
        poolPath: poolPath ? encodeURIComponent(poolPath) : undefined,
        page: pageParam,
        limit: STAKED_POSITIONS_PAGE_SIZE,
        stakedOnly: true,
        withClosed: false,
      }),
    getNextPageParam: (lastPage, pages) => {
      const loadedCount = pages.reduce((count, page) => count + page.positions.length, 0);
      return lastPage.positions.length > 0 && loadedCount < lastPage.totalCount ? pages.length + 1 : undefined;
    },
    enabled: !!address && availNetwork,
    keepPreviousData: false,
    // Reuse loaded pages on reopen, but honor invalidations from position mutations.
    staleTime: Infinity,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });
  const positions = useMemo(() => {
    const seen = new Set<string>();
    return (query.data?.pages ?? [])
      .flatMap(page => page.positions)
      .filter(position => {
        if (!position.staked || position.closed || seen.has(position.lpTokenId)) return false;
        seen.add(position.lpTokenId);
        return true;
      });
  }, [query.data]);
  return { ...query, positions };
};
