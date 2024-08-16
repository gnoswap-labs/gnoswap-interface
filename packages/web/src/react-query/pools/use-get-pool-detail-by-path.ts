import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { PoolDetailModel } from "@models/pool/pool-detail-model";
import { PoolError } from "@common/errors/pool";
import useCustomRouter from "@hooks/common/use-custom-router";

import { QUERY_KEY } from "../query-keys";

const REFETCH_INTERVAL = 60_000;

export const useGetPoolDetailByPath = (
  path: string | null,
  options?: UseQueryOptions<PoolDetailModel, Error>,
) => {
  const { poolRepository } = useGnoswapContext();
  const router = useCustomRouter();

  return useQuery<PoolDetailModel, Error>({
    queryKey: [QUERY_KEY.poolDetail, path],
    queryFn: async () => {
      if (!path) {
        throw new PoolError("NOT_FOUND_POOL");
      }
      const data = await poolRepository.getPoolDetailByPoolPath(path);
      return data;
    },
    onError: (err: Error) => {
      if (err instanceof PoolError) {
        router.movePage("EARN");
        return;
      }
    },
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchInterval: REFETCH_INTERVAL,
    ...options,
  });
};
