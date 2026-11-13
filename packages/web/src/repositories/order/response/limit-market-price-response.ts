import { LimitMarketPricePair } from "../request";

export interface LimitPoolMarketPrice {
  outputPerInput: string;
  poolPath: string;
  updatedBlockHeight: number;
  updatedBlockTime: number;
}

export interface LimitMarketPriceResponse extends LimitMarketPricePair {
  price: LimitPoolMarketPrice | null;
}
