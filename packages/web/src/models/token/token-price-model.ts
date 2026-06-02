import { IPricesBefore } from "./token-prices-before";
import { TOKEN_PRICE_GRADE_TYPE } from "./token-price-grade";

export interface Last7dPricePoint {
  time: string;
  price: string;
}

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
  last7d: Last7dPricePoint[];
  pricesBefore: IPricesBefore;
  volumeUsd24h: string;
  feeUsd24h: string;
  lockedTokensUsd: string;
  priceGradeType: TOKEN_PRICE_GRADE_TYPE;
}
