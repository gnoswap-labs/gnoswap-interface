import { WRAPPED_GNOT_PATH } from "@constants/environment.constant";

import { canonicalizeLimitMarketPricePairs, getLimitMarketPricePairKey } from "./limit-market-price-utils";

describe("limit market price pair utilities", () => {
  it("normalizes native aliases, omits unusable pairs, deduplicates and sorts directed pairs", () => {
    const canonical = canonicalizeLimitMarketPricePairs([
      { tokenIn: "ugnot", tokenOut: "gno.land/r/demo/b" },
      { tokenIn: WRAPPED_GNOT_PATH, tokenOut: "gno.land/r/demo/b" },
      { tokenIn: "gno.land/r/demo/b", tokenOut: WRAPPED_GNOT_PATH },
      { tokenIn: "", tokenOut: "gno.land/r/demo/a" },
      { tokenIn: "ugnot", tokenOut: WRAPPED_GNOT_PATH },
    ]);

    expect(canonical).toEqual([
      { tokenIn: "gno.land/r/demo/b", tokenOut: WRAPPED_GNOT_PATH },
      { tokenIn: WRAPPED_GNOT_PATH, tokenOut: "gno.land/r/demo/b" },
    ]);
  });

  it("uses a collision-free directed key", () => {
    expect(getLimitMarketPricePairKey({ tokenIn: "a:b", tokenOut: "c" })).not.toBe(
      getLimitMarketPricePairKey({ tokenIn: "a", tokenOut: "b:c" }),
    );
    expect(getLimitMarketPricePairKey({ tokenIn: "a", tokenOut: "b" })).not.toBe(
      getLimitMarketPricePairKey({ tokenIn: "b", tokenOut: "a" }),
    );
  });
});
