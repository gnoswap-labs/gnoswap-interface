import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { PoolModel } from "@models/pool/pool-model";
import { QUERY_KEY } from "./types";
import { encryptId } from "@utils/common";
import { PoolDetailModel } from "@models/pool/pool-detail-model";
import { PoolBinModel } from "@models/pool/pool-bin-model";
import { priceToNearTick } from "@utils/swap-utils";
import {
  SwapFeeTierInfoMap,
  SwapFeeTierType,
} from "@constants/option.constant";

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
      const tickSpacing = SwapFeeTierInfoMap[feeTier].tickSpacing;
      const currentTick = priceToNearTick(price, tickSpacing);
      const maxBinTick = priceToNearTick(price * 4, tickSpacing);

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
