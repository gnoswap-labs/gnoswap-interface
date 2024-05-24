export interface EstimateSwapRouteResponse {
  estimatedRoutes: EstimatedRoute[];
  amount: string;
}

export interface Route {
  pools: RoutePoolInfo[];
}

export interface EstimatedRoute extends Route {
  routeKey: string;
  quote: number;
  amountIn: bigint;
  amountOut: bigint;
}

export interface RoutePoolInfo {
  tokenA: string;
  tokenB: string;
  poolPath: string;
}
