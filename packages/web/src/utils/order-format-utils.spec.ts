import {
  calculatePriceDeviation,
  formatBps,
  formatOrderAmount,
  formatOrderFullAmount,
  formatOrderPriceDeviation,
  formatOrderRate,
  formatOrderRelativeDuration,
  formatOrderRoi,
  trimFractionZeros,
} from "./order-format-utils";

describe("order-format-utils", () => {
  it("trims fraction zeros and keeps suffixes", () => {
    expect(trimFractionZeros("12.00")).toBe("12");
    expect(trimFractionZeros("1.50K")).toBe("1.5K");
    expect(trimFractionZeros("1,000")).toBe("1,000");
    expect(trimFractionZeros("0.10")).toBe("0.1");
  });

  it("formats card amounts with two decimals, K/M/B and a lower bound", () => {
    expect(formatOrderAmount("632.129")).toBe("632.12");
    expect(formatOrderAmount("150")).toBe("150");
    expect(formatOrderAmount("9750")).toBe("9.75K");
    expect(formatOrderAmount("0.001")).toBe("<0.01");
    expect(formatOrderAmount("0")).toBe("0");
    expect(formatOrderAmount(null)).toBe("0");
  });

  it("formats modal amounts with every token decimal and no K/M/B", () => {
    expect(formatOrderFullAmount("106208.255", 6)).toBe("106,208.255");
    expect(formatOrderFullAmount("1.1234567", 6)).toBe("1.123456");
    expect(formatOrderFullAmount("0", 6)).toBe("0");
  });

  it("formats rates", () => {
    expect(formatOrderRate("0.9213751")).toBe("0.921375");
    expect(formatOrderRate("1.04")).toBe("1.04");
    expect(formatOrderRate(null)).toBe("-");
  });

  it("formats ROI with a direction marker", () => {
    expect(formatOrderRoi(0)).toEqual({ text: "▴ 0.00%", isNegative: false });
    expect(formatOrderRoi(1.526)).toEqual({ text: "▴ 1.52%", isNegative: false });
    expect(formatOrderRoi(-0.4)).toEqual({ text: "▾ 0.40%", isNegative: true });
    expect(formatOrderRoi(null)).toBeNull();
  });

  it("formats basis points", () => {
    expect(formatBps(15)).toBe("0.15%");
    expect(formatBps(100)).toBe("1%");
  });

  it("measures a price against its reference as a signed fraction", () => {
    expect(calculatePriceDeviation("1.1", "1")).toBe(0.1);
    expect(calculatePriceDeviation("0.95", "1")).toBe(-0.05);
    expect(calculatePriceDeviation("1.2716", "1.2716")).toBe(0);
    expect(calculatePriceDeviation(12, "8")).toBe(0.5);
    // Both prices are cut to six significant digits, so a +10% preset lands a hair under 10%.
    expect(calculatePriceDeviation("0.135801", "0.123456")).toBeCloseTo(0.1, 4);
  });

  it.each([
    ["a missing reference", "1.1", null],
    ["an undefined reference", "1.1", undefined],
    ["an empty reference", "1.1", ""],
    ["a zero reference", "1.1", "0"],
    ["a negative reference", "1.1", "-1"],
    ["a non-numeric reference", "1.1", "NaN"],
    ["an infinite reference", "1.1", "Infinity"],
    ["an empty price", "", "1"],
    ["a zero price", "0", "1"],
    ["a negative price", "-1", "1"],
    ["an infinite price", "Infinity", "1"],
  ])("has no deviation for %s", (_, price, referencePrice) => {
    expect(calculatePriceDeviation(price, referencePrice)).toBeNull();
  });

  it("formats a deviation as a signed percentage in the locale", () => {
    expect(formatOrderPriceDeviation(0.1, "en")).toBe("+10%");
    expect(formatOrderPriceDeviation(-0.05, "en")).toBe("-5%");
    expect(formatOrderPriceDeviation(0.123456, "en")).toBe("+12.35%");
    expect(formatOrderPriceDeviation(0.099995, "en")).toBe("+10%");
    expect(formatOrderPriceDeviation(0.1, "ko")).toBe("+10%");
    expect(formatOrderPriceDeviation(0.1234, "fr")).toMatch(/^\+12,34\s%$/);
  });

  it("shows no sign for market equality or a deviation that rounds to nothing", () => {
    expect(formatOrderPriceDeviation(0, "en")).toBe("0%");
    expect(formatOrderPriceDeviation(0.00004, "en")).toBe("0%");
    expect(formatOrderPriceDeviation(-0.00004, "en")).toBe("0%");
  });

  it("has no deviation text without a usable deviation", () => {
    expect(formatOrderPriceDeviation(null, "en")).toBeNull();
    expect(formatOrderPriceDeviation(undefined, "en")).toBeNull();
    expect(formatOrderPriceDeviation(Number.NaN, "en")).toBeNull();
    expect(formatOrderPriceDeviation(Number.POSITIVE_INFINITY, "en")).toBeNull();
  });

  it.each([
    [3_600, "in 1 hour"],
    [86_400, "in 1 day"],
    [604_800, "in 1 week"],
    [1_209_600, "in 2 weeks"],
    // 30 days is not a whole number of weeks and a month has no fixed length, so it stays in days.
    [2_592_000, "in 30 days"],
    [5_400, "in 90 minutes"],
    [90, "in 90 seconds"],
  ])("describes %i seconds as %s", (durationSec, expected) => {
    expect(formatOrderRelativeDuration(durationSec, "en")).toBe(expected);
  });

  it("describes a duration in the locale", () => {
    expect(formatOrderRelativeDuration(604_800, "ko")).toBe("1주 후");
    expect(formatOrderRelativeDuration(2_592_000, "fr")).toBe("dans 30 jours");
  });

  it.each([0, -3_600, 90.5, Number.NaN, Number.POSITIVE_INFINITY])("has no duration text for %s", durationSec => {
    expect(formatOrderRelativeDuration(durationSec, "en")).toBeNull();
  });
});
