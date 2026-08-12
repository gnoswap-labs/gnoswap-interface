import BigNumber from "bignumber.js";

import {
  PriceRangeMeta,
  PriceRangeType,
  SwapFeeTierMaxPriceRangeMap,
  SwapFeeTierPriceRange,
  SwapFeeTierType,
} from "@constants/option.constant";
import { formatRate } from "@utils/new-number-utils";
import { feeBoostRateByPrices, priceToTick, tickToPrice } from "@utils/swap-utils";

export interface PriceRangePrices {
  minPrice: number;
  maxPrice: number;
}

export interface PriceRangeAprOptions {
  currentPrice: number | null;
  feeTier: SwapFeeTierType | null;
  tickSpacing: number;
  feeApr: number | string | null | undefined;
  isCustomSelected: boolean;
  customMinPrice: number | null;
  customMaxPrice: number | null;
}

export const getPriceRangeByType = (
  currentPrice: number | null,
  feeTier: SwapFeeTierType | null,
  tickSpacing: number,
  priceRangeType: PriceRangeType,
): PriceRangePrices | null => {
  if (
    currentPrice === null ||
    !Number.isFinite(currentPrice) ||
    currentPrice <= 0 ||
    !feeTier ||
    feeTier === "NONE" ||
    !Number.isFinite(tickSpacing) ||
    tickSpacing <= 0
  ) {
    return null;
  }

  const configuredRange = SwapFeeTierPriceRange[feeTier][priceRangeType];
  const { minPrice, maxPrice } = SwapFeeTierMaxPriceRangeMap[feeTier];

  const getPriceWithTickSpacing = (range: number) => {
    const rangeDiffAmount = currentPrice * (range / 100);
    const currentTick = priceToTick(currentPrice + rangeDiffAmount);
    const nearTick = Math.round(currentTick / tickSpacing) * tickSpacing;
    return tickToPrice(nearTick);
  };

  const priceLower = getPriceWithTickSpacing(configuredRange.min);
  const priceUpper = getPriceWithTickSpacing(configuredRange.max);

  return {
    minPrice: priceLower < minPrice ? minPrice : priceLower,
    maxPrice: priceUpper > maxPrice ? maxPrice : priceUpper,
  };
};

export const calculatePriceRangeApr = (
  feeApr: number | string | null | undefined,
  minPrice: number | null,
  maxPrice: number | null,
  minPriceLimit?: number,
): string | undefined => {
  if (feeApr === null || feeApr === undefined || feeApr === "") {
    return undefined;
  }

  const feeAprNumber = Number(feeApr);
  if (
    !Number.isFinite(feeAprNumber) ||
    minPrice === null ||
    maxPrice === null ||
    !Number.isFinite(minPrice) ||
    !Number.isFinite(maxPrice) ||
    minPrice > maxPrice
  ) {
    return undefined;
  }

  const normalizedMinPrice = minPrice <= 0 && minPriceLimit !== undefined ? minPriceLimit : minPrice;
  const feeBoost = feeBoostRateByPrices(normalizedMinPrice, maxPrice);
  if (feeBoost === null || !Number.isFinite(Number(feeBoost))) {
    return undefined;
  }

  return BigNumber(feeAprNumber).multipliedBy(feeBoost).toFixed(2);
};

export const makePriceRangesWithApr = (
  priceRanges: PriceRangeMeta[],
  {
    currentPrice,
    feeTier,
    tickSpacing,
    feeApr,
    isCustomSelected,
    customMinPrice,
    customMaxPrice,
  }: PriceRangeAprOptions,
): PriceRangeMeta[] => {
  const minPriceLimit = feeTier ? SwapFeeTierMaxPriceRangeMap[feeTier]?.minPrice : undefined;

  return priceRanges.map(priceRange => {
    const prices =
      priceRange.type === "Custom"
        ? isCustomSelected && customMinPrice !== null && customMaxPrice !== null
          ? { minPrice: customMinPrice, maxPrice: customMaxPrice }
          : null
        : getPriceRangeByType(currentPrice, feeTier, tickSpacing, priceRange.type);

    return {
      ...priceRange,
      apr: prices ? calculatePriceRangeApr(feeApr, prices.minPrice, prices.maxPrice, minPriceLimit) : undefined,
    };
  });
};

export const formatPriceRangeApr = (apr: number | string | null | undefined): string => {
  if (apr === null || apr === undefined || apr === "") {
    return "-";
  }

  const formattedApr = formatRate(apr);
  return formattedApr === "-" ? "-" : `${formattedApr} APR`;
};
