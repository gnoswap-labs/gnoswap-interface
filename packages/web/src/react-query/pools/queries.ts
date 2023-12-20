import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { IPoolDetailResponse, PoolModel } from "@models/pool/pool-model";
import { QUERY_KEY } from "./types";
import { encriptId } from "@utils/common";

export const useGetPoolList = (
  options?: UseQueryOptions<PoolModel[], Error>
) => {
  const { poolRepository } = useGnoswapContext();

  return useQuery<PoolModel[], Error>({
    queryKey: [QUERY_KEY.pools],
    queryFn: async () => {
      const data = await poolRepository.getPools();
      data.sort((a: PoolModel, b: PoolModel) => - Number(a.price) + Number(b.price));
      return data;
    },
    ...options,
  });
};

export const useGetPoolDetailByPath = (
  path: string,
  options?: UseQueryOptions<IPoolDetailResponse, Error>
) => {
  const { poolRepository } = useGnoswapContext();
  const convertPath = encriptId(path);
  return useQuery<IPoolDetailResponse, Error>({
    queryKey: [QUERY_KEY.poolDetail, convertPath],
    queryFn: async () => {
      const data = await poolRepository.getPoolDetailByPath(convertPath);
      return data;
    },
    ...options,
  });
};