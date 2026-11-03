jest.mock("@constants/environment.constant", () => ({
  ...jest.requireActual("@constants/environment.constant"),
  WRAPPED_GNOT_PATH: "gno.land/r/gnoland/wugnot",
}));

import type { TokenModel } from "@models/token/token-model";
import type { DcaOrderItem, LimitOrderItem } from "@repositories/order/response";

import {
  calculateOrderRoi,
  calculatePriceRate,
  calculateProgress,
  canCancelLimitOrder,
  mapDcaOrderItemToModel,
  mapLimitOrderItemToModel,
  resolveOrderToken,
} from "./order-mapper";

const gns: TokenModel = {
  type: "GRC20",
  chainId: "",
  createdAt: "",
  name: "GnoSwap",
  path: "gno.land/r/gnoswap/gns",
  decimals: 6,
  symbol: "GNS",
  displaySymbol: "GNS",
  logoURI: "",
  priceID: "gno.land/r/gnoswap/gns",
};
const gnot: TokenModel = {
  ...gns,
  type: "Native",
  path: "ugnot",
  priceID: "ugnot",
  symbol: "GNOT",
  displaySymbol: "GNOT",
};
const eightDecimals: TokenModel = { ...gns, path: "gno.land/r/demo/btc", priceID: "btc", decimals: 8, symbol: "BTC" };
const tokens = [gns, gnot, eightDecimals];

const dcaItem: DcaOrderItem = {
  orderId: "42",
  owner: "g1",
  status: "ACTIVE",
  inputToken: "gno.land/r/gnoswap/gns",
  outputToken: "gno.land/r/gnoland/wugnot",
  interval: 3600,
  slotOffset: 0,
  groupId: "",
  amountPerExecution: "750000000",
  executionCount: 200,
  depositAmount: "150000000000",
  executedCount: 13,
  remainingCount: 187,
  soldAmount: "9750000000",
  purchasedAmount: "10140000000",
  remainingAmount: "140250000000",
  claimedAmount: "0",
  claimableAmount: "10140000000",
  nextExecutionAt: 1745833200,
  createdAt: 1745780000,
  createdTxHash: "tx",
  closedAt: null,
  closedTxHash: null,
  refundedAmount: "0",
};

describe("order-mapper", () => {
  it("shows wrapped GNOT as GNOT", () => {
    expect(resolveOrderToken("gno.land/r/gnoland/wugnot", tokens).path).toBe("ugnot");
    expect(resolveOrderToken("gno.land/r/gnoswap/gns", tokens)).toBe(gns);
  });

  it("applies each token's decimals to the price rate", () => {
    expect(calculatePriceRate(gns, gnot, "9750000000", "10140000000")).toBe("1.04");
    // 1 GNS (6 decimals) bought 0.5 BTC (8 decimals)
    expect(calculatePriceRate(gns, eightDecimals, "1000000", "50000000")).toBe("0.5");
    expect(calculatePriceRate(gns, gnot, "0", "100")).toBeNull();
  });

  it("clamps progress to 0-100", () => {
    expect(calculateProgress(13, 200)).toBe(6.5);
    expect(calculateProgress(3, 2)).toBe(100);
    expect(calculateProgress(1, 0)).toBe(0);
  });

  it("computes the cumulative return at current prices", () => {
    expect(calculateOrderRoi("100", "110", "1", "1")).toBeCloseTo(10);
    expect(calculateOrderRoi("100", "90", "1", "1")).toBeCloseTo(-10);
    expect(calculateOrderRoi("0", "0", "1", "1")).toBe(0);
    expect(calculateOrderRoi("100", "110", null, "1")).toBeNull();
  });

  it("maps a DCA order to display units", () => {
    const order = mapDcaOrderItemToModel(dcaItem, tokens);

    expect(order.isActive).toBe(true);
    expect(order.inputToken).toBe(gns);
    expect(order.outputToken.symbol).toBe("GNOT");
    expect(order.soldAmount).toBe("9750");
    expect(order.purchasedAmount).toBe("10140");
    expect(order.remainingAmount).toBe("140250");
    expect(order.amountPerExecution).toBe("750");
    expect(order.priceRate).toBe("1.04");
    expect(order.progress).toBe(6.5);
  });

  it("shows completed orders as full and cancelled ones at their real progress", () => {
    expect(mapDcaOrderItemToModel({ ...dcaItem, status: "COMPLETED" }, tokens).progress).toBe(100);
    const cancelled = mapDcaOrderItemToModel({ ...dcaItem, status: "CANCELLED", nextExecutionAt: null }, tokens);
    expect(cancelled.progress).toBe(6.5);
    expect(cancelled.remainingCount).toBe(0);
    expect(cancelled.nextExecutionAt).toBeNull();
  });

  it("keeps a completed DCA order claimable until its output is paid", () => {
    const completed = { ...dcaItem, status: "COMPLETED" as const, remainingCount: 0, nextExecutionAt: null };

    const unclaimed = mapDcaOrderItemToModel({ ...completed, claimedAmount: "0", claimableAmount: "450" }, tokens);
    expect(unclaimed.isActive).toBe(false);
    expect(unclaimed.canClaim).toBe(true);
    expect(unclaimed.claimableAmount).toBe("0.00045");
    expect(unclaimed.claimedAmount).toBe("0");

    const claimed = mapDcaOrderItemToModel({ ...completed, claimedAmount: "450", claimableAmount: "0" }, tokens);
    expect(claimed.canClaim).toBe(false);
    expect(claimed.claimedAmount).toBe("0.00045");

    // An active order pays its accrued output through Stop; a cancelled one already paid it.
    expect(mapDcaOrderItemToModel(dcaItem, tokens).canClaim).toBe(false);
    expect(mapDcaOrderItemToModel({ ...dcaItem, status: "CANCELLED" }, tokens).canClaim).toBe(false);
  });

  it("maps a limit order with its limit price and fill rate", () => {
    const item: LimitOrderItem = {
      orderId: "7",
      owner: "g1",
      status: "PARTIALLY_FILLED",
      tokenIn: "gno.land/r/gnoswap/gns",
      tokenOut: "gno.land/r/gnoland/wugnot",
      makingAmount: "3000000",
      takingAmount: "3814800",
      slippageBps: 50,
      executionFeeRate: 15,
      filledInput: "1000000",
      remainingInput: "2000000",
      refundedInput: "0",
      userOutput: "1271000",
      createdAt: 1,
      expiresAt: 2,
      createdTxHash: "tx",
      closedAt: null,
      closedTxHash: null,
    };

    const order = mapLimitOrderItemToModel(item, tokens);

    expect(order.isActive).toBe(true);
    expect(order.limitPrice).toBe("1.2716");
    expect(order.priceRate).toBe("1.271");
    expect(order.progress).toBeCloseTo(33.333, 2);
    expect(mapLimitOrderItemToModel({ ...item, status: "EXPIRED" }, tokens).isActive).toBe(false);
  });

  it("offers the limit cancel/refund while input is still escrowed, even after expiry", () => {
    const base = { remainingInput: "2000000", refundedInput: "0" };

    expect(canCancelLimitOrder({ ...base, status: "OPEN" })).toBe(true);
    expect(canCancelLimitOrder({ ...base, status: "PARTIALLY_FILLED" })).toBe(true);
    // Expired but not yet cleaned up: the realm still refunds through CancelOrder.
    expect(canCancelLimitOrder({ ...base, status: "EXPIRED" })).toBe(true);
    // Already refunded by cleanup, or nothing left to refund.
    expect(canCancelLimitOrder({ status: "EXPIRED", remainingInput: "0", refundedInput: "2000000" })).toBe(false);
    expect(canCancelLimitOrder({ status: "EXPIRED", remainingInput: "2000000", refundedInput: "2000000" })).toBe(false);
    expect(canCancelLimitOrder({ ...base, status: "CANCELLED" })).toBe(false);
    expect(canCancelLimitOrder({ status: "COMPLETED", remainingInput: "0", refundedInput: "0" })).toBe(false);
  });
});
