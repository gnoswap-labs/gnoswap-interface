import { getLiquidityForAmount0, getLiquidityForAmount1 } from "./liquidity-utils";

describe("getLiquidityForAmount0", () => {
  test("returns 0n when sqrtRatioAX96 is 0n", () => {
    expect(getLiquidityForAmount0(0n, 100n, 100n)).toBe(0n);
  });

  test("returns 0n when sqrtRatioBX96 is 0n", () => {
    expect(getLiquidityForAmount0(100n, 0n, 100n)).toBe(0n);
  });

  test("returns 0n when both ratios are equal", () => {
    expect(getLiquidityForAmount0(100n, 100n, 100n)).toBe(0n);
  });
});

describe("getLiquidityForAmount1", () => {
  test("returns 0n when sqrtRatioAX96 is 0n", () => {
    expect(getLiquidityForAmount1(0n, 100n, 100n)).toBe(0n);
  });

  test("returns 0n when sqrtRatioBX96 is 0n", () => {
    expect(getLiquidityForAmount1(100n, 0n, 100n)).toBe(0n);
  });

  test("returns 0n when both ratios are equal", () => {
    expect(getLiquidityForAmount1(100n, 100n, 100n)).toBe(0n);
  });
});
