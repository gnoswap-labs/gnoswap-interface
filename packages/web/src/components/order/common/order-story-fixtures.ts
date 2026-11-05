import { GNOT_TOKEN, GNS_TOKEN } from "@common/values/token-constant";
import { DcaOrderSummary, LimitOrderSummary, StopOrderSummary } from "@models/order/order-summary";

/** Shared fixtures for the order stories. */
export const STORY_GNS_TOKEN = { ...GNS_TOKEN, path: "gno.land/r/gnoswap/gns", priceID: "gno.land/r/gnoswap/gns" };
export const STORY_GNOT_TOKEN = GNOT_TOKEN;

export const STORY_DCA_ORDER_SUMMARY: DcaOrderSummary = {
  inputToken: STORY_GNS_TOKEN,
  outputToken: STORY_GNOT_TOKEN,
  sellAmount: "30000",
  sellAmountUsd: "$1,541.55",
  actualSellAmount: null,
  intervalUnit: "minute",
  executionCount: 25,
  rate: "1 GNS = 1.04 GNOT",
  rateUsd: "$1.04",
  amountPerOrder: "1,200",
  estimatedEndDate: "2026-11-03 20:35:36",
  routerFee: "0.15%",
  executionFee: "0.15%",
};

export const STORY_LIMIT_ORDER_SUMMARY: LimitOrderSummary = {
  tokenIn: STORY_GNS_TOKEN,
  tokenOut: STORY_GNOT_TOKEN,
  sellAmount: "1541.55",
  sellAmountUsd: "$1,541.55",
  buyAmount: "1960.24",
  buyAmountUsd: "$1,541.55",
  limitPrice: "1 GNS = 1.2716 GNOT",
  expiry: "1 Day",
  expiresAt: "2026-11-04 20:35:36",
  slippage: "0.5%",
};

export const STORY_STOP_ORDER_SUMMARY: StopOrderSummary = {
  kind: "dca",
  inputToken: STORY_GNS_TOKEN,
  outputToken: STORY_GNOT_TOKEN,
  statusLabel: "Ongoing",
  purchasedAmountUsd: "$1,005.05",
  soldAmount: "106,208.255",
  soldAmountUsd: "$1,000.05",
  purchasedAmount: "1,005.255",
  priceRate: "1.16524",
  priceRateUsd: "$1.05",
  remainingAmount: "6,208.255",
  remainingAmountUsd: "$600.05",
};
