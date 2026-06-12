import { TokenModel } from "@models/token/token-model";
import { filterAllowedIncentiveTokens } from "./incentive-token-filter";

function makeToken(symbol: string, path: string, wrappedPath?: string): TokenModel {
  return {
    path,
    wrappedPath,
    tokenId: path,
    type: path === "ugnot" ? "Native" : "GRC20",
    chainId: "dev.gnoswap",
    name: symbol,
    symbol,
    displaySymbol: symbol,
    decimals: 6,
    logoURI: "",
    createdAt: "",
    priceID: path,
  };
}

describe("filterAllowedIncentiveTokens", () => {
  it("returns only staker allowed external reward tokens", () => {
    const tokens = [
      makeToken("ATONE", "gno.land/r/demo/atone"),
      makeToken("USDC", "gno.land/r/demo/usdc"),
      makeToken("WUGNOT", "gno.land/r/gnoland/wugnot"),
      makeToken("GNS", "gno.land/r/gnoswap/gns"),
      makeToken("GNOT", "ugnot", "gno.land/r/gnoland/wugnot"),
    ];

    const result = filterAllowedIncentiveTokens(tokens, ["gno.land/r/gnoland/wugnot", "gno.land/r/gnoswap/gns"]);

    expect(result.map(token => token.symbol)).toEqual(["GNOT", "GNS"]);
  });

  it("sorts by allowed token path order instead of symbol order", () => {
    const tokens = [
      makeToken("AAA", "gno.land/r/gnoland/wugnot"),
      makeToken("ZZZ", "gno.land/r/gnoswap/gns"),
    ];

    const result = filterAllowedIncentiveTokens(tokens, ["gno.land/r/gnoswap/gns", "gno.land/r/gnoland/wugnot"]);

    expect(result.map(token => token.symbol)).toEqual(["ZZZ", "AAA"]);
  });

  it("deduplicates tokens by path", () => {
    const tokens = [
      makeToken("WUGNOT", "gno.land/r/gnoland/wugnot"),
      makeToken("WGNOT", "gno.land/r/gnoland/wugnot"),
    ];

    const result = filterAllowedIncentiveTokens(tokens, ["gno.land/r/gnoland/wugnot"]);

    expect(result.map(token => token.symbol)).toEqual(["WGNOT"]);
  });

  it("deduplicates wrapped GNOT and native GNOT by incentive path while preferring native GNOT", () => {
    const tokens = [
      makeToken("WUGNOT", "gno.land/r/gnoland/wugnot"),
      makeToken("GNOT", "ugnot", "gno.land/r/gnoland/wugnot"),
    ];

    const result = filterAllowedIncentiveTokens(tokens, ["gno.land/r/gnoland/wugnot"]);

    expect(result.map(token => token.symbol)).toEqual(["GNOT"]);
  });
});
