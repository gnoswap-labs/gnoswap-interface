import { BROADCAST_ERROR_VALUE, DCA_BROADCAST_ERROR_VALUE, getDcaBroadcastError } from "./broadcast-error";

describe("getDcaBroadcastError", () => {
  it.each([
    ["[GNOSWAP-ORDER-DCA-004] invalid amount", DCA_BROADCAST_ERROR_VALUE.AMOUNT_TOO_LOW],
    ["[GNOSWAP-ORDER-DCA-017] no eligible pool", DCA_BROADCAST_ERROR_VALUE.NO_ELIGIBLE_POOL],
    ["[GNOSWAP-ORDER-DCA-021] operation halted", DCA_BROADCAST_ERROR_VALUE.HALTED],
    ["[GNOSWAP-ORDER-DCA-027] missing price limit", DCA_BROADCAST_ERROR_VALUE.PAIR_NOT_SUPPORTED],
  ])("maps %s", (message, expected) => {
    expect(getDcaBroadcastError(message)).toBe(expected);
  });

  it("reads the code from inside a longer wallet message", () => {
    const message = "msg 0: VM call panic: [GNOSWAP-ORDER-DCA-027] missing price limit || gno.land/r/gnoswap/order/dca";
    expect(getDcaBroadcastError(message)).toBe(DCA_BROADCAST_ERROR_VALUE.PAIR_NOT_SUPPORTED);
  });

  it.each([
    ["an unmapped DCA code", "[GNOSWAP-ORDER-DCA-006] order not found"],
    ["another realm's code", "[GNOSWAP-ROUTER-018] insufficient balance for swap"],
    ["no code", "Transaction failed"],
    ["no message", undefined],
  ])("falls back to the default error for %s", (_, message) => {
    expect(getDcaBroadcastError(message)).toBe(BROADCAST_ERROR_VALUE.DEFAULT);
  });
});
