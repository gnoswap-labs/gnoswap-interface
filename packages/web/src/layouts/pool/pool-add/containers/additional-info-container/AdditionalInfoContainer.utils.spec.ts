import { resolvePoolAddInfo } from "./AdditionalInfoContainer.utils";

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

  it("keeps query values when they are complete", () => {
    const resolved = resolvePoolAddInfo({
      poolPath: "token-a:token-b:3000",
      tokenPair: ["token-a", "token-b"],
      currentPoolPath: "other-a:other-b:3000",
    });

    expect(resolved).toEqual({
      poolPath: "token-a:token-b:3000",
      tokenPair: ["token-a", "token-b"],
    });
  });
});
