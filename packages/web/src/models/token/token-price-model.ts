export interface TokenPriceModel {
  usd: number;
  changedBefore1D: number;
  changedBefore7D: number;
  changedBefore30D: number;
  marketCap: number;
  liquidity: number;
  volume: number;
}
