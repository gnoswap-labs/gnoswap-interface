import {
  clearPoolLiquiditySegmentMemoCache,
  getPoolLiquiditySegmentMemoByPath,
} from "@utils/pool-liquidity-segment-cache";

declare function describe(name: string, fn: () => void): void;
declare function it(name: string, fn: () => void): void;
declare function beforeEach(fn: () => void): void;
declare function expect(actual: unknown): {
  toBe(expected: unknown): void;
  not: {
    toBe(expected: unknown): void;
  };
};

describe("getPoolLiquiditySegmentMemoByPath", () => {
  beforeEach(() => clearPoolLiquiditySegmentMemoCache());

  it("reuses the same transform memo for positions sharing a poolPath", () => {
    const first = getPoolLiquiditySegmentMemoByPath("pool-a");
    const second = getPoolLiquiditySegmentMemoByPath("pool-a");
    const third = getPoolLiquiditySegmentMemoByPath("pool-b");

    expect(second).toBe(first);
    expect(third).not.toBe(first);
  });
});
