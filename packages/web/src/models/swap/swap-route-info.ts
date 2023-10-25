import { PoolModel } from "@models/pool/pool-model";
import { TokenModel } from "@models/token/token-model";
import { AmountModel } from "@models/common/amount-model";

export interface SwapRouteInfo {
  version: string;
  from: TokenModel;
  to: TokenModel;
  pools: PoolModel[];
  weight: number;
  gasFee: AmountModel;
  gasFeeUSD: number;
}
