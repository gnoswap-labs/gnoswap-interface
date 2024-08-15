import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { PoolBinModel } from "@models/pool/pool-bin-model";
import { priceToTick } from "@utils/swap-utils";
import { SwapFeeTierType } from "@constants/option.constant";

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
