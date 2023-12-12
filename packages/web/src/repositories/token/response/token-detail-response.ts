
export interface ITokenDetailResponse {
  market: IMarketResponse
  bestPools: IBestPoolResponse[]
  currentPrice: string
  prices1d: IPrices1d[]
  prices7d: IPrices7d[]
  prices1m: IPrices1m[]
  prices1y: IPrices1y[]
  pricesBefore: IPricesBefore
}

export interface IPriceResponse {
  date: string
  price: string
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
  
export interface IPrices1d {
  date: string
  price: string
}

export interface IPrices7d {
  date: string
  price: string
}

export interface IPrices1m {
  date: string
  price: string
}

export interface IPrices1y {
  date: string
  price: string
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

