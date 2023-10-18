import { SwapFeeTierType } from "@constants/option.constant";

export interface SwapPoolResponse {
  feeTier: SwapFeeTierType;

  poolPath: string;

  sqrtPriceX96: string;

  tickSpacing: number;
}
