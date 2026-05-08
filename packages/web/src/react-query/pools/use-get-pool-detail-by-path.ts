import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { PoolError } from "@common/errors/pool";
import useCustomRouter from "@hooks/common/use-custom-router";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { PoolDetailModel } from "@models/pool/pool-detail-model";

import { useForceRefetchQuery } from "@hooks/common/useForceRefetchQuery";
import { QUERY_KEY } from "../query-keys";

const REFETCH_INTERVAL = 60_000;

export const useGetPoolDetailByPathWithEmptyPath = (
  path: string | null,
  options?: UseQueryOptions<PoolDetailModel, Error>,
) => {
  const { data, isLoading, isError } = useGetPoolDetailByPath(
    path,
    {
      ...options,
      enabled: !!path,
    },
    false,
  );
  if (!path) {
    return { data: null, isLoading: false, isError: false };
  }

  return { data: path ? data : null, isLoading, isError };
};

export const useGetPoolDetailByPath = (
  path: string | null,
  options?: UseQueryOptions<PoolDetailModel, Error>,
  redirect: boolean = true,
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
      if (redirect) {
        if (err instanceof PoolError) {
          router.movePage("EARN");
          return;
        }
      }
    },
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchInterval: REFETCH_INTERVAL,
    ...options,
  });
};

export const useRefetchGetPoolDetailByPath = (poolPath: string | null | undefined) => {
  const refetchFn = useForceRefetchQuery();

  const refetchPoolDetails = async () => {
    if (!poolPath) {
      return;
    }

    await refetchFn({
      queryKey: [QUERY_KEY.poolDetail, poolPath],
      retry: 0,
    });
  };

  return { refetch: refetchPoolDetails };
};
