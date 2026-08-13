import BigNumber from "bignumber.js";

import { formatAmount, formatRawAmount, formatUsd } from "./display-number-utils";

describe("formatAmount", () => {
  it("formats zero as 0", () => {
    expect(formatAmount("0")).toBe("0");
  });

  it("formats a positive amount below the minimum as <0.000001", () => {
    expect(formatAmount("0.000000999")).toBe("<0.000001");
  });

  it("formats the exact minimum amount normally", () => {
    expect(formatAmount("0.000001")).toBe("0.000001");
  });

  it("truncates amounts to at most six fractional digits", () => {
    expect(formatAmount("0.123456789")).toBe("0.123456");
  });

  it("does not expose scientific notation", () => {
    expect(formatAmount("1.13e-7")).toBe("<0.000001");
    expect(formatAmount("1234.5")).toBe("1,234.5");
  });

  it("returns a dash for missing or invalid values", () => {
    expect(formatAmount(null)).toBe("-");
    expect(formatAmount(undefined)).toBe("-");
    expect(formatAmount("not-a-number")).toBe("-");
  });
});

describe("formatRawAmount", () => {
  it("converts raw units before applying amount formatting", () => {
    expect(formatRawAmount("1", 6)).toBe("0.000001");
    expect(formatRawAmount("113", 9)).toBe("<0.000001");
    expect(formatRawAmount("123456789", 6)).toBe("123.456789");
  });

  it("keeps exact raw precision without converting through a JavaScript number", () => {
    expect(formatRawAmount("9007199254740993", 0)).toBe("9,007,199,254,740,993");
  });

  it("accepts BigNumber raw values and preserves zero", () => {
    expect(formatRawAmount(BigNumber("0"), 6)).toBe("0");
  });
});

describe("formatUsd", () => {
  it("formats zero as $0", () => {
    expect(formatUsd("0")).toBe("$0");
  });

  it("formats a positive USD value below the minimum as <$0.01", () => {
    expect(formatUsd("0.009999")).toBe("<$0.01");
  });

  it("formats the exact minimum USD value normally", () => {
    expect(formatUsd("0.01")).toBe("$0.01");
  });

  it("formats normal USD values with two fractional digits", () => {
    expect(formatUsd("0.123")).toBe("$0.12");
    expect(formatUsd("1.2")).toBe("$1.20");
    expect(formatUsd("1234.56")).toBe("$1,234.56");
  });

  it("does not expose scientific notation", () => {
    expect(formatUsd("1.13e-7")).toBe("<$0.01");
  });

  it("returns a dash for missing or invalid values", () => {
    expect(formatUsd(null)).toBe("-");
    expect(formatUsd(undefined)).toBe("-");
    expect(formatUsd("not-a-number")).toBe("-");
  });
});
