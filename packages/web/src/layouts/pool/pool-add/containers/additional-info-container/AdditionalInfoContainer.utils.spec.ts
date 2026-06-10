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
});
