export interface LimitMarketPricePair {
  tokenIn: string;
  tokenOut: string;
}

export interface GetLimitMarketPricesRequest {
  pairs: LimitMarketPricePair[];
}
