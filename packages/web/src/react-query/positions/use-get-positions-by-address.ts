import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useMemo } from "react";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useWallet } from "@hooks/wallet/use-wallet";
import { PositionModel } from "@models/position/position-model";

import { QUERY_KEY } from "../query-keys";

const REFETCH_INTERVAL = 60_000;

interface UseGetPositionsByAddressProps {
  address?: string;
  isClosed?: boolean;
  poolPath?: string | null;
}

export const useGetPositionsByAddress = (
  props?: UseGetPositionsByAddressProps,
  options?: UseQueryOptions<PositionModel[], Error>,
) => {
  const { positionRepository } = useGnoswapContext();
  const { account, currentChainId, availNetwork } = useWallet();

  const address = useMemo(() => {
    return props?.address || account?.address || "";
  }, [account?.address, props?.address]);

  const poolPath = useMemo(() => {
    return props?.poolPath || "";
  }, [props?.poolPath]);

  return useQuery<PositionModel[], Error>({
    queryKey: [QUERY_KEY.positions, currentChainId, address, poolPath],
    queryFn: async () => {
      if (!availNetwork || !address) {
        return [];
      }

      return await positionRepository
        .getPositionsByAddress(address, {
          poolPath: encodeURIComponent(poolPath),
        })
        .catch(e => {
          console.error(e);
          return [];
        });
    },
    select: data => {
      if (props?.isClosed === undefined) {
        return data;
      }
      return data.filter(p => p.closed === props.isClosed);
    },
    refetchInterval: REFETCH_INTERVAL,
    refetchOnMount: true,
    refetchOnReconnect: true,
    ...options,
  });
};
