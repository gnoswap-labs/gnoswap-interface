import { TokenResponse } from "./token-response";

export interface PoolResponse {
  poolPath: string;
  tokenA: TokenResponse;
  tokenB: TokenResponse;
  tvl: string;
  volume: string;
  fee: string;
  currentTick: string;
  price: string;
  tokenABalance: string;
  tokenBBalance: string;
  tickSpacing: string;
}
