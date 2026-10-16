import { getGlobalCapRatio, getGnotUsdValue, getSwapFeeGnot, isSwapCapReached } from "./leaderboard-utils";

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

describe("getSwapFeeGnot", () => {
  it("divides the swap points before the cap by the swap points per GNOT", () => {
    expect(getSwapFeeGnot("37.37")).toBe("7.474");
  });

  it("is null without swap points", () => {
    expect(getSwapFeeGnot(undefined)).toBeNull();
  });
});

describe("getGnotUsdValue", () => {
  it("multiplies the GNOT amount by the GNOT price", () => {
    expect(getGnotUsdValue("7.474", "0.0575")).toBe("0.429755");
  });

  it("is null without a price", () => {
    expect(getGnotUsdValue("7.474", undefined)).toBeNull();
  });
});
