import type { TokenModel } from "@models/token/token-model";

import { resolvePoolAddInfo, resolvePoolAddToken } from "./AdditionalInfoContainer.utils";

const tokenA = {
  path: "token-a",
  tokenId: "token-a",
  type: "GRC20",
  chainId: "dev",
  name: "Token A",
  symbol: "TKNA",
  displaySymbol: "TKNA",
  decimals: 6,
  logoURI: "",
  createdAt: "",
  priceID: "token-a",
} satisfies TokenModel;

const getGnotPath = (token: TokenModel) => ({
  path: token.path,
  name: token.name,
  symbol: token.symbol,
  displaySymbol: token.displaySymbol,
  logoURI: token.logoURI,
  wrappedPath: token.wrappedPath ?? "",
});

describe("resolvePoolAddInfo", () => {
  it("uses current pool path when client navigation has not populated query tokens", () => {
    const resolved = resolvePoolAddInfo({
      poolPath: null,
      tokenPair: [undefined, undefined],
      currentPoolPath: "gno.land/r/gnoswap/gns:gno.land/r/gnoswap/test_token/test_usdc:3000",
    });

    expect(resolved).toEqual({
      poolPath: "gno.land/r/gnoswap/gns:gno.land/r/gnoswap/test_token/test_usdc:3000",
      tokenPair: ["gno.land/r/gnoswap/gns", "gno.land/r/gnoswap/test_token/test_usdc"],
    });
  });

  it("uses current pool path when client navigation leaves stale query tokens", () => {
    const resolved = resolvePoolAddInfo({
      poolPath: "token-a:token-b:3000",
      tokenPair: ["token-a", "token-b"],
      currentPoolPath: "current-a:current-b:3000",
    });

    expect(resolved).toEqual({
      poolPath: "current-a:current-b:3000",
      tokenPair: ["current-a", "current-b"],
    });
  });

  it("keeps query values when they are complete and current pool path is empty", () => {
    const resolved = resolvePoolAddInfo({
      poolPath: "token-a:token-b:3000",
      tokenPair: ["token-a", "token-b"],
      currentPoolPath: null,
    });

    expect(resolved).toEqual({
      poolPath: "token-a:token-b:3000",
      tokenPair: ["token-a", "token-b"],
    });
  });

  it("keeps pool path but clears token pair when query tokens are incomplete", () => {
    const resolved = resolvePoolAddInfo({
      poolPath: "token-a:token-b:3000",
      tokenPair: ["token-a", null],
      currentPoolPath: null,
    });

    expect(resolved).toEqual({
      poolPath: "token-a:token-b:3000",
      tokenPair: [],
    });
  });

  it("falls back to complete query values when current pool path is malformed", () => {
    const resolved = resolvePoolAddInfo({
      poolPath: "token-a:token-b:3000",
      tokenPair: ["token-a", "token-b"],
      currentPoolPath: "no-colons",
    });

    expect(resolved).toEqual({
      poolPath: "token-a:token-b:3000",
      tokenPair: ["token-a", "token-b"],
    });
  });

  it("returns empty values when all inputs are empty", () => {
    const resolved = resolvePoolAddInfo({
      poolPath: null,
      tokenPair: [],
      currentPoolPath: null,
    });

    expect(resolved).toEqual({
      poolPath: null,
      tokenPair: [],
    });
  });

  it("normalizes query token pairs to the first two paths", () => {
    const resolved = resolvePoolAddInfo({
      poolPath: "token-a:token-b:3000",
      tokenPair: ["token-a", "token-b", "token-c"],
      currentPoolPath: null,
    });

    expect(resolved).toEqual({
      poolPath: "token-a:token-b:3000",
      tokenPair: ["token-a", "token-b"],
    });
  });
});

describe("resolvePoolAddToken", () => {
  it("returns null when token path is empty", () => {
    const resolved = resolvePoolAddToken({
      tokenPath: undefined,
      tokens: [tokenA],
      getGnotPath,
    });

    expect(resolved).toBeNull();
  });

  it("returns null when token path cannot be resolved from token data", () => {
    const resolved = resolvePoolAddToken({
      tokenPath: "missing-token",
      tokens: [tokenA],
      getGnotPath,
    });

    expect(resolved).toBeNull();
  });

  it("returns the resolved token model when token path exists", () => {
    const resolved = resolvePoolAddToken({
      tokenPath: "token-a",
      tokens: [tokenA],
      getGnotPath,
    });

    expect(resolved).toEqual({
      ...tokenA,
      wrappedPath: "",
    });
  });
});
