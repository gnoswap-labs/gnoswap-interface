
export interface ITokenDetailResponse {
  prices: IPriceResponse[]
  priceChangeDetail: IPriceChangeDetailResponse
  market: IMarketResponse
  bestPools: IBestPoolResponse[]
  currentPrice: string;
}

export interface IPriceResponse {
  date: string
  price: string
}
  
export interface IPriceChangeDetailResponse {
  priceToday: string
  changeToday: string
  price1h: string
  change1h: string
  price1d: string
  change1d: string
  price7d: string
  change7d: string
  price30d: string
  change30d: string
  price60d: string
  change60d: string
  price90d: string
  change90d: string
}
  
export interface IMarketResponse {
  popularity: string
  tvl: string
  volume24h: string
  fees24h: string
}

export interface IBestPoolResponse {
  poolPath: string
  fee: string
  tokenA: ITokenA
  tokenB: ITokenB
  tvl: string
  apr: string
}
  
export interface ITokenA {
  type: string
  name: string
  path: string
  symbol: string
  logoURI: string
}
  
export interface ITokenB {
  type: string
  name: string
  path: string
  symbol: string
  logoURI: string
}
  