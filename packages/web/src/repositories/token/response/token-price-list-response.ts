import { TokenPriceModel } from "@models/token/token-price-model";

export interface TokenPriceListResponse {
  prices: {
    [tokenPriceId in string]: TokenPriceModel;
  };
}
