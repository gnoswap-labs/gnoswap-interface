import { TokenModel } from "@models/token/token-model";
import { AmountModel } from "@models/common/amount-model";

export interface Route {
  pools: RoutePoolInfo[];
}

export interface EstimatedRoute extends Route {
  routeKey: string;
  quote: number;
  amountIn: bigint;
  amountOut: bigint;
}

export interface SwapRouteInfo {
  version: string;
  from: TokenModel;
  to: TokenModel;
  pools: RoutePoolInfo[];
  weight: number;
  gasFee: AmountModel;
  gasFeeUSD: number;
}

export interface RoutePoolInfo {
  tokenA: string;
  tokenB: string;
  fee: number;
  price: number;
  tokenABalance: number;
  tokenBBalance: number;
  poolPath: string;
}
