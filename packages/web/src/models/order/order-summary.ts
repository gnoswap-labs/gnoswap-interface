import { TokenModel } from "@models/token/token-model";

import { DcaIntervalUnit } from "./dca-order-model";

/** Everything the DCA detail panel and confirm modal show, already formatted. */
export interface DcaOrderSummary {
  inputToken: TokenModel;
  outputToken: TokenModel;
  /** Sell amount as typed. */
  sellAmount: string;
  sellAmountUsd: string;
  /** What is actually escrowed (`amountPerExecution × count`), when it differs from the typed amount. */
  actualSellAmount: string | null;
  intervalUnit: DcaIntervalUnit;
  executionCount: number;
  /** `1 input = rate output`, formatted. */
  rate: string;
  rateUsd: string;
  amountPerOrder: string;
  estimatedEndDate: string;
  /** The DCA realm's fee on each execution's output; `rate` is already net of it. */
  executionFee: string;
}

/**
 * Everything the limit confirm modal shows, already formatted, plus the two raw values it formats
 * for the current language (`limitPriceDeviation`, `expiryDurationSec`).
 */
export interface LimitOrderSummary {
  tokenIn: TokenModel;
  tokenOut: TokenModel;
  sellAmount: string;
  sellAmountUsd: string;
  buyAmount: string;
  buyAmountUsd: string;
  /** The least output the owner receives after execution fees at the selected slippage, for a full fill. */
  minimumReceived: string;
  limitPrice: string;
  /**
   * How far `limitPrice` sits from the market price quoted when this summary was built, as a signed
   * fraction: `0.1` is 10% above market, `-0.05` is 5% below. Null without a positive market quote.
   */
  limitPriceDeviation: number | null;
  expiresAt: string;
  /** The selected expiry in seconds, the distance from now to `expiresAt`. */
  expiryDurationSec: number;
  slippage: string;
  executionFee: string;
}

/** Everything the stop / cancel confirm modal shows, already formatted. */
export interface StopOrderSummary {
  kind: "dca" | "limit";
  inputToken: TokenModel;
  outputToken: TokenModel;
  statusLabel: string;
  /** USD value of what was purchased so far. */
  purchasedAmountUsd: string;
  soldAmount: string;
  soldAmountUsd: string;
  purchasedAmount: string;
  priceRate: string;
  priceRateUsd: string;
  /** What the stop refunds. */
  remainingAmount: string;
  remainingAmountUsd: string;
}
