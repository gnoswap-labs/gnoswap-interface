import { IPricesBefore } from "./token-prices-before";

export interface TokenPriceModel {
  path: string;
  usd: string;
  change1h: string;
  change1d: string;
  change7d: string;
  change30d: string;
  marketCap: string;
  liquidity: string;
  volume: string;
  mostLiquidityPool: string;
  last7d: { date: string, price: string }[];
  pricesBefore: IPricesBefore;
  volumeUsd24h: string;
  feeUsd24h: string;
  lockedTokensUsd: string;
}

