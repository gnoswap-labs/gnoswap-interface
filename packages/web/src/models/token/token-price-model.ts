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
  lockedTokensUsd: string;
}

export interface IPricesBefore {
  latestPrice: string
  priceToday: string
  price1h: string
  price2h: string
  price1d: string
  price2d: string
  price7d: string
  price8d: string
  price30d: string
  price31d: string
  price60d: string
  price61d: string
  price90d: string
  price91d: string
}