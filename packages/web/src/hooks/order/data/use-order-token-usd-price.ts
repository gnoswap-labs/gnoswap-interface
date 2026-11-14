import { useCallback } from "react";

import { EMPTY_TOKEN_PRICES } from "@common/values/token-constant";
import { TokenModel } from "@models/token/token-model";
import { useGetAllTokenPrices } from "@query/token";
import { checkGnotPath } from "@utils/common";

/**
 * The current USD price of an order's token, read from the one shared token price query so the order list never
 * requests a price per order. Null while the price is unknown.
 */
export const useOrderTokenUsdPrice = () => {
  const { data: tokenPrices = EMPTY_TOKEN_PRICES } = useGetAllTokenPrices();

  return useCallback(
    (token: TokenModel | null): string | null => {
      if (!token) return null;
      return tokenPrices[checkGnotPath(token.priceID)]?.usd ?? tokenPrices[checkGnotPath(token.path)]?.usd ?? null;
    },
    [tokenPrices],
  );
};
