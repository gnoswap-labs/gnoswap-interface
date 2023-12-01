import { TokenModel } from "@models/token/token-model";
import { AmountModel } from "@models/common/amount-model";
import { Pool } from "@gnoswap-labs/swap-router";

export interface SwapRouteInfo {
  version: string;
  from: TokenModel;
  to: TokenModel;
  pools: Pool[];
  weight: number;
  gasFee: AmountModel;
  gasFeeUSD: number;
}
