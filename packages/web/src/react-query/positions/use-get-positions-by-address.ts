import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useMemo } from "react";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { GetPositionsByAddressResult } from "@repositories/position/response";

import { QUERY_KEY } from "../query-keys";

const REFETCH_INTERVAL = 5_000;

interface UseGetPositionsByAddressProps {
  address?: string;
  isClosed?: boolean;
  poolPath?: string | null;
  page?: number;
  limit?: number;
  withClosed?: boolean;
}

export const useGetPositionsByAddress = (
  props?: UseGetPositionsByAddressProps,
  options?: UseQueryOptions<GetPositionsByAddressResult, Error>,
) => {
  const { positionRepository } = useGnoswapContext();
  const { account, currentChainId, availNetwork } = useWallet();

  const address = useMemo(() => {
    return props?.address || account?.address || "";
  }, [account?.address, props?.address]);

  const poolPath = useMemo(() => {
    return props?.poolPath || "";
  }, [props?.poolPath]);

  return useQuery<GetPositionsByAddressResult, Error>({
    queryKey: [
      QUERY_KEY.positions,
      currentChainId,
      address,
      poolPath,
      props?.page,
      props?.limit,
      props?.withClosed,
      props?.isClosed,
    ],
    queryFn: async () => {
      if (!availNetwork || !address) {
        return { positions: [], totalCount: 0 };
      }

      return await positionRepository
        .getPositionsByAddress(address, {
          poolPath: poolPath ? encodeURIComponent(poolPath) : undefined,
          page: props?.page,
          limit: props?.limit,
          withClosed: props?.withClosed,
          isClosed: props?.isClosed,
        })
        .catch(e => {
          console.error(e);
          return { positions: [], totalCount: 0 };
        });
    },
    select: data => {
      if (props?.isClosed === undefined) {
        return data;
      }
      return {
        positions: data.positions.filter(p => p.closed === props.isClosed),
        totalCount: data.totalCount,
      };
    },
    keepPreviousData: true,
    refetchInterval: REFETCH_INTERVAL,
    refetchOnMount: true,
    refetchOnReconnect: true,
    ...options,
  });
};
