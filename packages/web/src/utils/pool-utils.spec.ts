import { TokenModel } from "@models/token/token-model";
import { invertSqrtPriceX96, isOrderedTokenPaths, isValidCurrentPrice, makeDisplayPrice, makeRawPrice } from "./pool-utils";

const TWO_192 = BigInt("6277101735386680763835789423207666416102355444464034512896");

const makeToken = (symbol: string, decimals: number): TokenModel => ({
  path: `gno.land/r/demo/${symbol.toLowerCase()}`,
  type: "GRC20",
  chainId: "test-chain",
  name: symbol,
  symbol,
  decimals,
  logoURI: "",
  createdAt: "",
  priceID: symbol,
});

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

describe("price display/raw conversion", () => {
  it("should convert BTC/USDC display price into the raw tick domain and back", () => {
    const btc = makeToken("BTC", 8);
    const usdc = makeToken("USDC", 6);

    const rawPrice = makeRawPrice(1, btc, usdc);

    expect(rawPrice).toBe(0.01);
    expect(makeDisplayPrice(rawPrice, btc, usdc)).toBe(1);
  });

  it("should preserve equal-decimal token prices", () => {
    const tokenA = makeToken("A", 6);
    const tokenB = makeToken("B", 6);

    const rawPrice = makeRawPrice(1.25, tokenA, tokenB);

    expect(rawPrice).toBe(1.25);
    expect(makeDisplayPrice(rawPrice, tokenA, tokenB)).toBe(1.25);
  });
});

describe("isOrderedPrice comparator consistency", () => {
  it("isOrderedTokenPaths should agree with lexical <= for distinct paths", () => {
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
        const sortOrder = isOrderedTokenPaths(pathA, pathB);

        expect(lexicalOrder).toBe(sortOrder);
      }
    }
  });

  it("should handle equal paths correctly", () => {
    const samePathA = "gno.land/r/gnoswap/gns";
    const samePathB = "gno.land/r/gnoswap/gns";
    expect(samePathA <= samePathB).toBe(true);
    expect(isOrderedTokenPaths(samePathA, samePathB)).toBe(true);
  });
});

describe("isValidCurrentPrice", () => {
  it("should reject null", () => {
    expect(isValidCurrentPrice(null)).toBe(false);
  });

  it("should reject undefined", () => {
    expect(isValidCurrentPrice(undefined)).toBe(false);
  });

  it("should reject 0", () => {
    expect(isValidCurrentPrice(0)).toBe(false);
  });

  it("should reject Infinity (1 / 0 case)", () => {
    expect(isValidCurrentPrice(1 / 0)).toBe(false);
  });

  it("should reject -Infinity", () => {
    expect(isValidCurrentPrice(-Infinity)).toBe(false);
  });

  it("should reject NaN", () => {
    expect(isValidCurrentPrice(NaN)).toBe(false);
  });

  it("should accept positive finite numbers", () => {
    expect(isValidCurrentPrice(1.5)).toBe(true);
    expect(isValidCurrentPrice(0.001)).toBe(true);
    expect(isValidCurrentPrice(1000000)).toBe(true);
  });

  it("should accept negative finite numbers", () => {
    expect(isValidCurrentPrice(-1.5)).toBe(true);
  });
});
