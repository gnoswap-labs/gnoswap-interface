import { SwapFeeTierPriceRange, SwapFeeTierType } from "@constants/option.constant";
import { feeBoostRateByPrices, priceToTick, tickToPrice } from "@utils/swap-utils";

import {
  calculatePriceRangeApr,
  formatPriceRangeApr,
  getPriceRangeByType,
  makePriceRangesWithApr,
} from "./select-price-range.utils";

describe("getPriceRangeByType", () => {
  it("uses the configured percentage range and fee-tier tick spacing", () => {
    const currentPrice = 1;
    const feeTier: SwapFeeTierType = "FEE_3000";
    const tickSpacing = 60;
    const configuredRange = SwapFeeTierPriceRange[feeTier].Active;

    const range = getPriceRangeByType(currentPrice, feeTier, tickSpacing, "Active");

    const expectedMinTick =
      Math.round(priceToTick(currentPrice * (1 + configuredRange.min / 100)) / tickSpacing) * tickSpacing;
    const expectedMaxTick =
      Math.round(priceToTick(currentPrice * (1 + configuredRange.max / 100)) / tickSpacing) * tickSpacing;

    expect(range).toEqual({ minPrice: tickToPrice(expectedMinTick), maxPrice: tickToPrice(expectedMaxTick) });
  });
});

describe("calculatePriceRangeApr", () => {
  it("calculates APR from the pool fee APR and range fee boost", () => {
    expect(calculatePriceRangeApr("4.32", 0.9, 1.1)).toBe(
      (Number("4.32") * Number(feeBoostRateByPrices(0.9, 1.1))).toFixed(2),
    );
  });

  it("returns no APR when the pool has no APR data", () => {
    expect(calculatePriceRangeApr(null, 0.9, 1.1)).toBeUndefined();
    expect(calculatePriceRangeApr("", 0.9, 1.1)).toBeUndefined();
  });
});

describe("makePriceRangesWithApr", () => {
  const priceRanges = [{ type: "Active" }, { type: "Passive" }, { type: "Custom" }] as const;

  it("keeps every range APR empty when the pool has no fee APR", () => {
    const ranges = makePriceRangesWithApr([...priceRanges], {
      currentPrice: 1,
      feeTier: "FEE_3000",
      tickSpacing: 60,
      feeApr: null,
      isCustomSelected: false,
      customMinPrice: 0.9,
      customMaxPrice: 1.1,
    });

    expect(ranges.every(range => range.apr === undefined)).toBe(true);
  });

  it("does not calculate the Custom APR before Custom is selected", () => {
    const ranges = makePriceRangesWithApr([...priceRanges], {
      currentPrice: 1,
      feeTier: "FEE_3000",
      tickSpacing: 60,
      feeApr: "4.32",
      isCustomSelected: false,
      customMinPrice: 0.9,
      customMaxPrice: 1.1,
    });

    expect(ranges.find(range => range.type === "Custom")?.apr).toBeUndefined();
  });

  it("recalculates the Custom APR from the current min and max prices", () => {
    const initialRanges = makePriceRangesWithApr([...priceRanges], {
      currentPrice: 1,
      feeTier: "FEE_3000",
      tickSpacing: 60,
      feeApr: "4.32",
      isCustomSelected: true,
      customMinPrice: 0.9,
      customMaxPrice: 1.1,
    });
    const changedRanges = makePriceRangesWithApr([...priceRanges], {
      currentPrice: 1,
      feeTier: "FEE_3000",
      tickSpacing: 60,
      feeApr: "4.32",
      isCustomSelected: true,
      customMinPrice: 0.8,
      customMaxPrice: 1.2,
    });

    expect(initialRanges.find(range => range.type === "Custom")?.apr).toBe(calculatePriceRangeApr("4.32", 0.9, 1.1));
    expect(changedRanges.find(range => range.type === "Custom")?.apr).toBe(calculatePriceRangeApr("4.32", 0.8, 1.2));
    expect(changedRanges.find(range => range.type === "Custom")?.apr).not.toBe(
      initialRanges.find(range => range.type === "Custom")?.apr,
    );
  });
});

describe("formatPriceRangeApr", () => {
  it("formats an APR value with the APR suffix", () => {
    expect(formatPriceRangeApr("4.32")).toBe("4.32% APR");
  });

  it("uses a dash when APR data is unavailable", () => {
    expect(formatPriceRangeApr(undefined)).toBe("-");
    expect(formatPriceRangeApr(null)).toBe("-");
    expect(formatPriceRangeApr("")).toBe("-");
  });
});
