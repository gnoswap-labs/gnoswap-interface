import { TokenModel } from "@models/token/token-model";

export interface Route {
  pools: RoutePoolInfo[];
}

export interface EstimatedRoute extends Route {
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
