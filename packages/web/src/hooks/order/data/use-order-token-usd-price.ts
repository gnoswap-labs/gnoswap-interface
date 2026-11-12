import { useCallback } from "react";

import { TokenModel } from "@models/token/token-model";
import { TokenPriceModel } from "@models/token/token-price-model";
import { useGetAllTokenPrices } from "@query/token";
import { checkGnotPath } from "@utils/common";

const EMPTY_TOKEN_PRICES: Record<string, TokenPriceModel> = {};

/**
 * The current USD price of an order's token, read from the one shared token price query so the order list never
 * requests a price per order. Null while the price is unknown.
 */
export const useOrderTokenUsdPrice = () => {
  const { data: tokenPrices = EMPTY_TOKEN_PRICES } = useGetAllTokenPrices();

  return useCallback(
    (token: TokenModel): string | null =>
      tokenPrices[checkGnotPath(token.priceID)]?.usd ?? tokenPrices[checkGnotPath(token.path)]?.usd ?? null,
    [tokenPrices],
  );
};
