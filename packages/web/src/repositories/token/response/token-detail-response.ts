export interface ITokenDetailResponse {
  market: IMarketResponse;
  bestPools: IBestPoolResponse[];
  currentPrice: string;
  prices1d: IPriceResponse[];
  prices7d: IPriceResponse[];
  prices1m: IPriceResponse[];
  prices1y: IPriceResponse[];
  pricesBefore: IPricesBefore;
}

export interface IPriceResponse {
  time: string;
  price: string;
}

export interface IMarketResponse {
  popularity: string;
  lockedTokensUsd: string;
  volumeUsd24h: string;
  feesUsd24h: string;
}

export interface IBestPoolResponse {
  poolPath: string;
  fee: string;
  tokenA: IBestPoolToken;
  tokenB: IBestPoolToken;
  tvlUsd: string;
  apr: string;
}

export interface IBestPoolToken {
  type: string;
  name: string;
  path: string;
  tokenId: string;
  symbol: string;
  displaySymbol: string;
  logoURI: string;
}

export interface IPricesBefore {
  latestPrice: string;
  priceToday: string;
  price1h: string;
  price2h: string;
  price1d: string;
  price2d: string;
  price7d: string;
  price8d: string;
  price30d: string;
  price31d: string;
  price60d: string;
  price61d: string;
  price90d: string;
  price91d: string;
}
