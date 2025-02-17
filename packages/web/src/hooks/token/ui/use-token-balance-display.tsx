import React from "react";
import { formatTokenBalanceDisplay } from "@utils/token-utils";

interface TokenBalancesDisplay {
  tokenA: string;
  tokenB: string;
}

/**
 * Custom hooks to convert single token balance to display formats
 *
 * @param tokenBalance
 * @param connectedWallet
 * @returns {string}
 */
export const useTokenBalanceDisplay = (tokenBalance: string, connectedWallet: boolean): string => {
  return React.useMemo(() => formatTokenBalanceDisplay(tokenBalance, connectedWallet), [tokenBalance, connectedWallet]);
};

/**
 * Custom hook to convert the balance of pair tokens to fit the display format
 *
 * @param tokenABalance
 * @param tokenBBalance
 * @param connectedWallet
 * @returns {TokenBalancesDisplay}
 */
export const useTokenBalancesDisplay = (
  tokenABalance: string,
  tokenBBalance: string,
  connectedWallet: boolean,
): TokenBalancesDisplay => {
  return React.useMemo(
    () => ({
      tokenA: formatTokenBalanceDisplay(tokenABalance, connectedWallet),
      tokenB: formatTokenBalanceDisplay(tokenBBalance, connectedWallet),
    }),
    [tokenABalance, tokenBBalance, connectedWallet],
  );
};
