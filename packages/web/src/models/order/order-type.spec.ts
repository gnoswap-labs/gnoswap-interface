import { getEnabledSwapCardTypes, hasOrderSwapCardTypes, SWAP_CARD_TYPE, toEnabledSwapCardType } from "./order-type";

describe("order-type", () => {
  it("enables each order mode only when its realm path is configured", () => {
    expect(getEnabledSwapCardTypes({ dcaOrderPath: "gno.land/r/dca", limitOrderPath: "gno.land/r/limit" })).toEqual([
      "swap",
      "dca",
      "limit",
    ]);
    expect(getEnabledSwapCardTypes({ dcaOrderPath: "gno.land/r/dca", limitOrderPath: "" })).toEqual(["swap", "dca"]);
    expect(getEnabledSwapCardTypes({ dcaOrderPath: "", limitOrderPath: "gno.land/r/limit" })).toEqual([
      "swap",
      "limit",
    ]);
    expect(getEnabledSwapCardTypes({ dcaOrderPath: "", limitOrderPath: "" })).toEqual(["swap"]);
  });

  it("has no order UI when neither realm is configured", () => {
    expect(hasOrderSwapCardTypes(getEnabledSwapCardTypes({ dcaOrderPath: "", limitOrderPath: "" }))).toBe(false);
    expect(hasOrderSwapCardTypes(getEnabledSwapCardTypes({ dcaOrderPath: "", limitOrderPath: "x" }))).toBe(true);
  });

  it("falls back to Swap for a disabled or unknown mode in the query", () => {
    const dcaOnly = getEnabledSwapCardTypes({ dcaOrderPath: "gno.land/r/dca", limitOrderPath: "" });

    expect(toEnabledSwapCardType("dca", dcaOnly)).toBe(SWAP_CARD_TYPE.DCA);
    expect(toEnabledSwapCardType("limit", dcaOnly)).toBe(SWAP_CARD_TYPE.SWAP);
    expect(toEnabledSwapCardType("unknown", dcaOnly)).toBe(SWAP_CARD_TYPE.SWAP);
    expect(toEnabledSwapCardType(undefined, dcaOnly)).toBe(SWAP_CARD_TYPE.SWAP);
  });
});
