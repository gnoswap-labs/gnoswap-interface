import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { IncentivizePoolModel, PoolModel } from "@models/pool/pool-model";
import { QUERY_KEY } from "./types";
import { encryptId } from "@utils/common";
import { PoolDetailModel } from "@models/pool/pool-detail-model";
import { PoolBinModel } from "@models/pool/pool-bin-model";
import { priceToTick } from "@utils/swap-utils";
import { SwapFeeTierType } from "@constants/option.constant";
import { PoolDetailRPCModel } from "@models/pool/pool-detail-rpc-model";
import { useRouter } from "next/navigation";

export const useGetPoolCreationFee = (
  options?: UseQueryOptions<number, Error>,
) => {
  const { poolRepository } = useGnoswapContext();

  return useQuery<number, Error>({
    queryKey: [QUERY_KEY.poolCreationFee],
    queryFn: async () => {
      return poolRepository.getCreationFee();
    },
    ...options,
  });
};

export const useGetRPCPoolsBy = (
  poolPaths: string[],
  options?: UseQueryOptions<PoolDetailRPCModel[], Error>,
) => {
  const { poolRepository } = useGnoswapContext();

  return useQuery<PoolDetailRPCModel[], Error>({
    queryKey: [QUERY_KEY.rpcPools, poolPaths.join("_")],
    queryFn: async () => {
      const pools: PoolDetailRPCModel[] = [];
      for (const poolPath of poolPaths) {
        const pool = await poolRepository
          .getPoolDetailRPCByPoolPath(poolPath)
          .catch(() => null);
        if (pool) {
          pools.push(pool);
        }
      }
      return pools;
    },
    enabled: poolPaths.length > 0,
    ...options,
  });
};

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

export const useGetIncentivizePoolList = (
  options?: UseQueryOptions<IncentivizePoolModel[], Error>,
) => {
  const { poolRepository } = useGnoswapContext();

  return useQuery<IncentivizePoolModel[], Error>({
    queryKey: [QUERY_KEY.incentivizePools],
    queryFn: async () => {
      const data = await poolRepository.getIncentivizePools();
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
  const router = useRouter();

  return useQuery<PoolDetailModel, Error>({
    queryKey: [QUERY_KEY.poolDetail, convertPath],
    queryFn: async () => {
      const data = await poolRepository.getPoolDetailByPoolPath(convertPath);
      return data;
    },
    onError: (err: any) => {
      if (err["response"]["status"] === 404) {
        router.push("/404");
      }
    },
    ...options,
  });
};

export const useGetSimpleBinsByPath = (
  path: string,
  enabled: boolean,
  options?: UseQueryOptions<PoolBinModel[], Error>,
) => {
  const { poolRepository } = useGnoswapContext();
  const convertPath = encryptId(path);
  const count = 20;
  return useQuery<PoolBinModel[], Error>({
    queryKey: [QUERY_KEY.lazyBins, convertPath],
    queryFn: async () => {
      return poolRepository.getBinsOfPoolByPath(convertPath, count);
    },
    ...options,
    enabled: enabled && !!path,
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

export const useInitializeBins = (
  feeTier: SwapFeeTierType | null,
  startPrice: number | null,
  count?: number,
  isReverse?: boolean,
  options?: UseQueryOptions<PoolBinModel[], Error>,
) => {
  return useQuery<PoolBinModel[], Error>({
    queryFn: async () => {
      if (!feeTier || !startPrice) {
        return [];
      }
      const price = isReverse ? 1 / startPrice : startPrice;
      const initializeCount = count ?? 40;
      const currentTick = priceToTick(price);
      const maxBinTick = priceToTick(price * 4);

      const center = initializeCount / 2;
      const tickGap = Math.round(
        (maxBinTick - currentTick) / (initializeCount / 2),
      );

      const bins = Array.from({ length: initializeCount / 2 })
        .flatMap((_, index) => {
          const minBin: PoolBinModel = {
            index: center - index - 1,
            liquidity: 0,
            reserveTokenA: 0,
            reserveTokenB: 0,
            minTick: currentTick - tickGap * (index + 1) + 1,
            maxTick: currentTick - tickGap * index,
          };
          const maxBin: PoolBinModel = {
            index: center + index,
            liquidity: 0,
            reserveTokenA: 0,
            reserveTokenB: 0,
            minTick: currentTick + tickGap * index,
            maxTick: currentTick + tickGap * (index + 1) - 1,
          };
          return [minBin, maxBin];
        })
        .sort(bin => bin.minTick);

      return bins;
    },
    ...options,
  });
};
