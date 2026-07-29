import BigNumber from "bignumber.js";
import { useCallback } from "react";

import { useGetAllTokenPrices, useGetTokens } from "@query/token";

/**
 * Lightweight pricing hook that provides token metadata and USD pricing without
 * balance side-effects (no useGetGrc20Balances, no updateBalances, no RPC calls).
 *
 * Use when a consumer needs tokens + tokenPrices + getTokenUSDPrice only.
 */
export const useTokenPricing = () => {
  const { data: { tokens = [] } = {}, isFetched: isFetchedTokens } = useGetTokens();
  const { data: tokenPrices = {} } = useGetAllTokenPrices();

  const getTokenUSDPrice = useCallback(
    (tokenAId: string, amount: bigint | string | number) => {
      const tokenUSDPrice = tokenPrices[tokenAId]?.usd || "0";
      const amountValue = BigNumber(amount.toString());
      const priceValue = BigNumber(tokenUSDPrice);
      const usdValue = amountValue.multipliedBy(priceValue);

      if (!amountValue.isFinite() || !priceValue.isFinite() || !usdValue.isFinite()) {
        return null;
      }
      return usdValue.toNumber();
    },
    [tokenPrices],
  );

  return { tokens, tokenPrices, getTokenUSDPrice, isFetchedTokens };
};
