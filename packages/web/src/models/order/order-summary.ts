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
  routerFee: string;
  networkGasFee: string;
  networkGasFeeUsd: string;
}

/** Everything the limit confirm modal shows, already formatted. */
export interface LimitOrderSummary {
  tokenIn: TokenModel;
  tokenOut: TokenModel;
  sellAmount: string;
  sellAmountUsd: string;
  buyAmount: string;
  buyAmountUsd: string;
  limitPrice: string;
  expiry: string;
  expiresAt: string;
  slippage: string;
  networkGasFee: string;
  networkGasFeeUsd: string;
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
