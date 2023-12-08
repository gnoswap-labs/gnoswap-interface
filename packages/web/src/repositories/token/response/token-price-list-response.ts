import { TokenPriceModel } from "@models/token/token-price-model";

export interface TokenPriceListResponse {
  prices: TokenPriceModel[];
}

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
  tokenALogo: string
  tokenBLogo: string
  poolPath: string
  fee: string
  tvl: string
  apr: string
}
