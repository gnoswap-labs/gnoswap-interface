import { TokenPriceModel } from "@models/token/token-price-model";

export interface TokenPriceListResponse {
  message: string;
  count: number;
  meta: {
    timestamp: number;
    ageRaw: number;
  };
  prices: {
    [tokenPriceId in string]: TokenPriceModel;
  };
}
