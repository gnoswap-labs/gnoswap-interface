import {
  formatBps,
  formatOrderAmount,
  formatOrderFullAmount,
  formatOrderRate,
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
});
