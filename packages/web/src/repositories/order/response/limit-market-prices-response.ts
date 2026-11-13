import { LimitMarketPricePair } from "../request";

export interface LimitPoolMarketPrice {
  outputPerInput: string;
  poolPath: string;
  updatedBlockHeight: number;
  updatedBlockTime: number;
}

export interface LimitMarketPriceResult extends LimitMarketPricePair {
  price: LimitPoolMarketPrice | null;
}

export interface LimitMarketPricesResponse {
  items: LimitMarketPriceResult[];
}
