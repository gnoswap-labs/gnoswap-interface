import { getGlobalCapRatio, isSwapCapReached, formatGnsAmount, getGnotValueOfUsd } from "./leaderboard-utils";

describe("isSwapCapReached", () => {
  it("is reached when the swap points before the cap exceed the cap", () => {
    expect(isSwapCapReached("900", "50")).toBe(true);
  });

  it("is not reached at or below the cap", () => {
    expect(isSwapCapReached("50", "50")).toBe(false);
    expect(isSwapCapReached("37.37", "205403.55")).toBe(false);
  });

  it("is not reached without values", () => {
    expect(isSwapCapReached(undefined, "50")).toBe(false);
    expect(isSwapCapReached("900", "")).toBe(false);
  });
});

describe("getGlobalCapRatio", () => {
  it("divides the accepted swap points by the wallet-capped swap points", () => {
    // Wallet-capped swap points are min(before cap, cap) = 90.
    expect(getGlobalCapRatio("45", "90", "500")).toBe("0.50");
    // Wallet-capped swap points are the cap = 50.
    expect(getGlobalCapRatio("25", "900", "50")).toBe("0.50");
  });

  it("is 1.00 when the global cap is not reached", () => {
    expect(getGlobalCapRatio("37.37", "37.37", "205403.55")).toBe("1.00");
  });

  it("never exceeds 1.00", () => {
    expect(getGlobalCapRatio("90.0000001", "90", "500")).toBe("1.00");
  });

  it("is null without wallet-capped swap points", () => {
    expect(getGlobalCapRatio("0", "0", "500")).toBeNull();
    expect(getGlobalCapRatio("0", "900", "0")).toBeNull();
    expect(getGlobalCapRatio(undefined, "90", "500")).toBeNull();
  });
});

describe("formatGnsAmount", () => {
  it("formats base units as whole GNS", () => {
    expect(formatGnsAmount("2500000000000")).toBe("2,500,000");
    expect(formatGnsAmount("1234567")).toBe("1.23");
  });

  it("is a dash without an amount", () => {
    expect(formatGnsAmount(undefined)).toBe("-");
    expect(formatGnsAmount("")).toBe("-");
  });
});

describe("getGnotValueOfUsd", () => {
  it("divides the USD value by the GNOT USD price", () => {
    expect(getGnotValueOfUsd("35200", "0.05")).toBe("704000");
    expect(getGnotValueOfUsd("10", 2)).toBe("5");
  });

  it("is null without a usable price", () => {
    expect(getGnotValueOfUsd("10", undefined)).toBeNull();
    expect(getGnotValueOfUsd("10", "0")).toBeNull();
    expect(getGnotValueOfUsd(undefined, "1")).toBeNull();
  });
});
