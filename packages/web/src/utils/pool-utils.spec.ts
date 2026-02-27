import { invertSqrtPriceX96, isOrderedTokenPaths } from "./pool-utils";

const TWO_192 = BigInt("6277101735386680763835789423207666416102355444464034512896");

describe("invertSqrtPriceX96", () => {
  it("should return 0n when input is 0n", () => {
    expect(invertSqrtPriceX96(0n)).toBe(0n);
  });

  it("should return TWO_192 when input is 1n", () => {
    expect(invertSqrtPriceX96(1n)).toBe(TWO_192);
  });

  it("should return 1n when input is TWO_192", () => {
    expect(invertSqrtPriceX96(TWO_192)).toBe(1n);
  });

  it("should correctly invert a typical sqrtPriceX96 value", () => {
    // A common sqrtPriceX96 value representing price ~1.0 (2^96)
    const sqrtPriceX96 = BigInt("79228162514264337593543950336"); // 2^96
    const result = invertSqrtPriceX96(sqrtPriceX96);
    // TWO_192 / 2^96 = 2^192 / 2^96 = 2^96
    expect(result).toBe(sqrtPriceX96);
  });

  it("should satisfy the invariant: invert(invert(x)) ≈ x for large values", () => {
    const original = BigInt("79228162514264337593543950336"); // 2^96
    const inverted = invertSqrtPriceX96(original);
    const doubleInverted = invertSqrtPriceX96(inverted);
    expect(doubleInverted).toBe(original);
  });

  it("should handle small sqrtPriceX96 values", () => {
    const small = 100n;
    const result = invertSqrtPriceX96(small);
    expect(result).toBe(TWO_192 / small);
    expect(result > 0n).toBe(true);
  });

  it("should handle large sqrtPriceX96 values", () => {
    const large = TWO_192 - 1n;
    const result = invertSqrtPriceX96(large);
    expect(result).toBe(TWO_192 / large);
    expect(result).toBe(1n);
  });
});

describe("isOrderedTokenPaths", () => {
  it("should return true when tokenA path comes first lexicographically", () => {
    expect(isOrderedTokenPaths("gno.land/r/aaa", "gno.land/r/zzz")).toBe(true);
  });

  it("should return false when tokenA path comes after tokenB", () => {
    expect(isOrderedTokenPaths("gno.land/r/zzz", "gno.land/r/aaa")).toBe(false);
  });

  it("should return true when paths are identical", () => {
    expect(isOrderedTokenPaths("gno.land/r/abc", "gno.land/r/abc")).toBe(true);
  });

  it("should handle typical token paths (GNS vs GNOT)", () => {
    const gnsPath = "gno.land/r/gnoswap/gns";
    const wgnotPath = "gno.land/r/gnoland/wugnot";
    // "gno.land/r/gnoland/wugnot" < "gno.land/r/gnoswap/gns" lexicographically
    expect(isOrderedTokenPaths(wgnotPath, gnsPath)).toBe(true);
    expect(isOrderedTokenPaths(gnsPath, wgnotPath)).toBe(false);
  });
});

describe("isOrderedPrice comparator consistency", () => {
  // This test demonstrates the potential inconsistency between
  // lexical `<=` comparison and `sortTokenPaths`
  it("sortTokenPaths and <= should produce consistent ordering for distinct paths", () => {
    const paths = [
      "gno.land/r/gnoswap/gns",
      "gno.land/r/gnoland/wugnot",
      "gno.land/r/demo/bar",
      "gno.land/r/demo/foo",
      "gno.land/r/demo/usdt",
    ];

    for (const pathA of paths) {
      for (const pathB of paths) {
        if (pathA === pathB) continue;

        const lexicalOrder = pathA <= pathB;
        const sortOrder =
          [pathA, pathB].sort((a, b) => {
            if (a === b) return 0;
            return a > b ? 1 : -1;
          })[0] === pathA;

        expect(lexicalOrder).toBe(sortOrder);
      }
    }
  });

  // When paths are equal, `<=` returns true, but sortTokenPaths[0] === pathA is also true.
  // This is fine. The real concern is whether checkGnotPath could introduce a case
  // where GNOT -> wrappedPath changes the ordering result.
  it("should handle equal paths correctly - both <= and sort return true", () => {
    const samePath = "gno.land/r/gnoswap/gns";
    expect(samePath <= samePath).toBe(true);
    expect([samePath, samePath].sort()[0] === samePath).toBe(true);
  });
});

describe("depositRatio price inversion edge cases", () => {
  it("1 / 0 produces Infinity which is truthy", () => {
    const price = 0;
    const currentPrice = 1 / price;
    // This demonstrates the bug: Infinity is truthy, so `!currentPrice` is false
    expect(currentPrice).toBe(Infinity);
    expect(!currentPrice).toBe(false); // Infinity passes the !currentPrice check
    expect(Number.isFinite(currentPrice)).toBe(false); // but fails isFinite
  });

  it("1 / -0 produces -Infinity which is also truthy", () => {
    const price = -0;
    const currentPrice = 1 / price;
    expect(currentPrice).toBe(-Infinity);
    expect(!currentPrice).toBe(false);
    expect(Number.isFinite(currentPrice)).toBe(false);
  });

  it("Number.isFinite correctly guards against Infinity", () => {
    expect(Number.isFinite(Infinity)).toBe(false);
    expect(Number.isFinite(-Infinity)).toBe(false);
    expect(Number.isFinite(NaN)).toBe(false);
    expect(Number.isFinite(0)).toBe(true);
    expect(Number.isFinite(1.5)).toBe(true);
  });
});
