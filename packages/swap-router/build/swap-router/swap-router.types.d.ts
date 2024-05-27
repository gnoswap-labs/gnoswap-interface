import { Pool } from "../swap-simulator/swap-simulator.types";
export interface Route {
    pools: Pool[];
}
export interface RouteWithQuote {
    routeKey: string;
    route: Route;
    amountIn: bigint;
    amountOut: bigint;
    quote: number;
    amountRatio: number;
}
export interface EstimatedRoute extends Route {
    routeKey: string;
    quote: number;
    amountIn: bigint;
    amountOut: bigint;
}
