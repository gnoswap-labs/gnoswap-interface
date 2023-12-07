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
  last7Days: { date: string, price: string }[];
}
