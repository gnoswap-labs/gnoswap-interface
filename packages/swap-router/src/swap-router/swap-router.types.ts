import { Pool } from "../swap-simulator/swap-simulator.types";

export interface Route {
  pools: Pool[];
}

export interface EstimatedRoute extends Route {
  quote: number;

  amountIn: bigint;

  amountOut: bigint;
}
