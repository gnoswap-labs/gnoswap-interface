import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { PoolModel } from "@models/pool/pool-model";
import { QUERY_KEY } from "./types";
import { encryptId } from "@utils/common";
import { PoolDetailModel } from "@models/pool/pool-detail-model";
import { PoolBinModel } from "@models/pool/pool-bin-model";

export const useGetPoolList = (
  options?: UseQueryOptions<PoolModel[], Error>,
) => {
  const { poolRepository } = useGnoswapContext();

  return useQuery<PoolModel[], Error>({
    queryKey: [QUERY_KEY.pools],
    queryFn: async () => {
      const data = await poolRepository.getPools();
      data.sort(
        (a: PoolModel, b: PoolModel) => -Number(a.price) + Number(b.price),
      );
      return data;
    },
    ...options,
  });
};

export const useGetPoolDetailByPath = (
  path: string,
  options?: UseQueryOptions<PoolDetailModel, Error>,
) => {
  const { poolRepository } = useGnoswapContext();
  const convertPath = encryptId(path);
  return useQuery<PoolDetailModel, Error>({
    queryKey: [QUERY_KEY.poolDetail, convertPath],
    queryFn: async () => {
      const data = await poolRepository.getPoolDetailByPoolPath(convertPath);
      return data;
    },
    ...options,
  });
};

export const useGetBinsByPath = (
  path: string,
  count?: number,
  options?: UseQueryOptions<PoolBinModel[], Error>,
) => {
  const { poolRepository } = useGnoswapContext();
  const convertPath = encryptId(path);
  return useQuery<PoolBinModel[], Error>({
    queryKey: [QUERY_KEY.bins, convertPath],
    queryFn: async () => {
      return poolRepository.getBinsOfPoolByPath(convertPath, count);
    },
    ...options,
  });
};
