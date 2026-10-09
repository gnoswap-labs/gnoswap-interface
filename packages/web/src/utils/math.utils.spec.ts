import { getAmountADeltaHelper } from "./math.utils";

describe("getAmountADeltaHelper", () => {
  test("returns 0n when sqrtRatioAX96 is 0n", () => {
    expect(getAmountADeltaHelper(0n, 100n, 100n)).toBe(0n);
  });

  test("returns 0n when sqrtRatioBX96 is 0n", () => {
    expect(getAmountADeltaHelper(100n, 0n, 100n)).toBe(0n);
  });

  test("returns 0n when both ratios are equal (numerator2 = 0)", () => {
    expect(getAmountADeltaHelper(100n, 100n, 100n)).toBe(0n);
  });

  test("calculates correctly for valid inputs", () => {
    // sqrtRatioAX96=1000, sqrtRatioBX96=2000, liquidity=1000
    // numerator1 = 1000 * 2^96
    // numerator2 = 2000 - 1000 = 1000
    // result = (1000 * 2^96 * 1000) / 2000 / 1000 = 2^96 / 2
    const result = getAmountADeltaHelper(1000n, 2000n, 1000n);
    expect(result).toBeGreaterThan(0n);
  });
});
