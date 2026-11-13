import {
  calculateLimitMinimumReceived,
  calculateLimitMinimumRemainingReceived,
  estimateLimitExecutionFee,
} from "./order-amount-utils";

type Terms = Parameters<typeof calculateLimitMinimumRemainingReceived>[0];

describe("calculateLimitMinimumRemainingReceived", () => {
  // Raw terms of an order selling 100 tokens for 12.4308 of the output token at 0.5% slippage, still unfilled.
  const minimumRemaining = (terms: Partial<Terms> = {}) =>
    calculateLimitMinimumRemainingReceived({
      takingAmount: "12430800",
      makingAmount: "100000000",
      remainingInput: "100000000",
      slippageBps: 50,
      ...terms,
    });

  it("takes the owner-net minimum of the unfilled input from the raw terms", () => {
    // 12430800 × 65000000 × 9950 / (100000000 × 10000) = 8039619.9
    expect(minimumRemaining({ remainingInput: "65000000" })).toBe("8039620");
  });

  it("is the full minimum while nothing is filled, and zero once nothing remains", () => {
    expect(minimumRemaining()).toBe(calculateLimitMinimumReceived("12430800", 50));
    expect(minimumRemaining()).toBe("12368646");
    expect(minimumRemaining({ remainingInput: "0" })).toBe("0");
  });

  it("adds nothing when the share divides exactly, and rounds up to the next raw unit otherwise", () => {
    // Half the order: 12430800 × 0.5 × 0.995 = 6184323
    expect(minimumRemaining({ remainingInput: "50000000" })).toBe("6184323");
    // 10 / 3 = 3.33, so 4: rounding to the nearest unit would promise less than the realm requires
    expect(minimumRemaining({ takingAmount: "10", makingAmount: "3", remainingInput: "1", slippageBps: 0 })).toBe("4");
  });

  it("rounds once from the raw terms, not the full minimum scaled by the unfilled share", () => {
    // Exactly 100 × 2 × 9950 / (199 × 10000) = 1. The full minimum rounds up to 100, and 100 × 2 / 199 would give 2.
    expect(minimumRemaining({ takingAmount: "100", makingAmount: "199", remainingInput: "2" })).toBe("1");
  });

  it("keeps the fraction that decides the ceiling beyond 20 decimal places", () => {
    // (10^22 + 1) / 10^22 = 1.0000000000000000000001, which a 20 decimal place quotient would round down to 1
    expect(
      minimumRemaining({
        takingAmount: "10000000000000000000001",
        makingAmount: "10000000000000000000000",
        remainingInput: "1",
        slippageBps: 0,
      }),
    ).toBe("2");
  });

  it("keeps every digit of raw amounts above the safe integer range", () => {
    // Half of 1000000000000000001 × 0.995 = 497500000000000000.4975
    expect(
      minimumRemaining({
        takingAmount: "1000000000000000001",
        makingAmount: "2000000000000000002",
        remainingInput: "1000000000000000001",
      }),
    ).toBe("497500000000000001");
  });

  it("supports the full slippage range", () => {
    expect(minimumRemaining({ remainingInput: "65000000", slippageBps: 0 })).toBe("8080020");
    expect(minimumRemaining({ remainingInput: "65000000", slippageBps: 10_000 })).toBe("0");
  });

  it("is zero for an order with no making amount to divide by", () => {
    expect(minimumRemaining({ makingAmount: "0" })).toBe("0");
    expect(minimumRemaining({ makingAmount: "" })).toBe("0");
  });
});

describe("estimateLimitExecutionFee", () => {
  it.each([
    ["1", 15, "0"],
    ["666", 15, "0"],
    ["667", 15, "1"],
    ["30000000", 15, "45067"],
    ["30000000", 0, "0"],
    ["9007199254740993", 1000, "1000799917193443"],
  ] as const)("estimates the gross-output fee for net %s at %s bps", (net, rate, fee) => {
    expect(estimateLimitExecutionFee(net, rate)).toBe(fee);
    const gross = BigInt(net) + BigInt(fee);
    expect(gross - (gross * BigInt(rate)) / 10_000n).toBe(BigInt(net));
    const previous = gross - 1n;
    expect(previous - (previous * BigInt(rate)) / 10_000n).toBeLessThan(BigInt(net));
  });

  it.each([
    ["", 15],
    ["0", 15],
    ["-1", 15],
    ["1.5", 15],
    ["10", null],
    ["10", undefined],
    ["10", -1],
    ["10", 10_000],
    ["10", 1.5],
  ])("does not invent a fee for invalid net %s or unknown rate %s", (net, rate) => {
    expect(estimateLimitExecutionFee(net as string, rate as number | null | undefined)).toBeNull();
  });
});
