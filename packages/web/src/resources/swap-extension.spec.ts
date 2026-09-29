import { getAddressByPackagePath } from "@utils/package-utils";

import {
  createOriginToken,
  getSwapExtensionByOriginPath,
  getSwapExtensionByWrappedPath,
  normalizeSwapExtensionSelection,
  resolveSwapExtensionExecution,
  swapExtensions,
} from "./swap-extension";

describe("swap-extension metadata", () => {
  const extension = swapExtensions[0];
  const wrappedToken = {
    type: "GRC20" as const,
    chainId: "gnoland-1",
    createdAt: "2026-01-01T00:00:00Z",
    name: "Bubble (wrapped)",
    path: extension.grc20WrappedTokenPath,
    decimals: 6,
    symbol: "BUBBLE",
    displaySymbol: "BUBBLE",
    logoURI: "wrapped-logo.svg",
    priceID: extension.grc20WrappedTokenPath,
  };

  it("indexes an extension by its distinct origin and wrapped token paths", () => {
    expect(extension.grc20WrappedTokenPath).toBe(`${extension.grc20WrappedPackagePath}.BUBBLE`);
    expect(getSwapExtensionByOriginPath(extension.originTokenPath)).toBe(extension);
    expect(getSwapExtensionByWrappedPath(extension.grc20WrappedTokenPath)).toBe(extension);
  });

  it("creates the origin token from extension metadata and wrapped-token runtime data", () => {
    expect(createOriginToken(extension, wrappedToken)).toMatchObject({
      type: "Native",
      path: extension.originTokenPath,
      wrappedPath: extension.grc20WrappedTokenPath,
      logoURI: wrappedToken.logoURI,
      priceID: extension.grc20WrappedTokenPath,
      pkgPath: extension.originTokenPath,
    });
  });

  it("resolves wrap execution placeholders without embedding a realm address", () => {
    expect(resolveSwapExtensionExecution(extension, "wrap", { amount: "1250000" })).toEqual([
      {
        packagePath: extension.originTokenPath,
        function: "Approve",
        inputs: [getAddressByPackagePath(extension.grc20WrappedPackagePath), "1250000"],
      },
      {
        packagePath: extension.grc20WrappedPackagePath,
        function: "Wrap",
        inputs: ["1250000"],
      },
    ]);
  });

  it("forces an origin selection into its wrapped pair", () => {
    const originToken = createOriginToken(extension, wrappedToken);
    const ordinaryToken = { ...wrappedToken, path: "gno.land/r/demo/foo.FOO" };

    expect(normalizeSwapExtensionSelection("A", originToken, ordinaryToken, [wrappedToken])).toMatchObject({
      tokenA: originToken,
      tokenB: wrappedToken,
      isWrapPair: true,
    });
  });

  it("replaces an origin with its wrapper before selecting an ordinary token", () => {
    const originToken = createOriginToken(extension, wrappedToken);
    const ordinaryToken = { ...wrappedToken, path: "gno.land/r/demo/foo.FOO" };

    expect(normalizeSwapExtensionSelection("B", ordinaryToken, originToken, [wrappedToken])).toMatchObject({
      tokenA: wrappedToken,
      tokenB: ordinaryToken,
      isWrapPair: false,
    });
  });
});
