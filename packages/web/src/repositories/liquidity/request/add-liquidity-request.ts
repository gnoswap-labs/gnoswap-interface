import { TokenInfo } from "@models/token/token-info";

export interface AddLiquidityRequest {
  tokenA: TokenInfo;
  tokenB: TokenInfo;
  tokenAAmount: number;
  tokenBAmount: number;
  fee: number;
  minPrice: number;
  maxPrice: number;
}
