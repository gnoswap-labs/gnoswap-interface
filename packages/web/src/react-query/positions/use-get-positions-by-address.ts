import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useMemo } from "react";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { GetPositionsByAddressResult } from "@repositories/position/response";

import { QUERY_KEY } from "../query-keys";

const REFETCH_INTERVAL = 5_000;
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

interface UseGetPositionsByAddressProps {
  address?: string;
  poolPath?: string | null;
  page?: number;
  limit?: number;
  /** API option: when true, include closed positions in the server response. */
  withClosed?: boolean;
  withAvailableStake?: boolean;
}

export const useGetPositionsByAddress = (
  props?: UseGetPositionsByAddressProps,
  options?: Omit<
    UseQueryOptions<GetPositionsByAddressResult, Error, GetPositionsByAddressResult>,
    "queryKey" | "queryFn"
  >,
) => {
  const { positionRepository } = useGnoswapContext();
  const { account, currentChainId, availNetwork } = useWallet();

  const address = useMemo(() => {
    return props?.address || account?.address || "";
  }, [account?.address, props?.address]);

  const poolPath = useMemo(() => {
    return props?.poolPath || "";
  }, [props?.poolPath]);

  const page = props?.page ?? DEFAULT_PAGE;
  const limit = props?.limit ?? DEFAULT_LIMIT;
  const withClosed = props?.withClosed ?? true;
  const withAvailableStake = props?.withAvailableStake ?? false;

  return useQuery<GetPositionsByAddressResult, Error, GetPositionsByAddressResult>(
    [
      QUERY_KEY.positions,
      currentChainId,
      address,
      poolPath,
      page,
      limit,
      withClosed,
      withAvailableStake,
    ],
    async () => {
      if (!availNetwork || !address) {
        return { positions: [], totalCount: 0 };
      }

      return await positionRepository
        .getPositionsByAddress(address, {
          poolPath: poolPath ? encodeURIComponent(poolPath) : undefined,
          page,
          limit,
          withClosed,
          withAvailableStake,
        })
        .catch(e => {
          console.error(e);
          return { positions: [], totalCount: 0 };
        });
    },
    {
      keepPreviousData: true,
      refetchInterval: REFETCH_INTERVAL,
      refetchOnMount: true,
      refetchOnReconnect: true,
      ...options,
    },
  );
};
