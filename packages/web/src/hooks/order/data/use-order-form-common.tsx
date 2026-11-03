import BigNumber from "bignumber.js";
import { useCallback, useMemo, useState } from "react";

import { GNOT_TOKEN } from "@common/values/token-constant";
import { useTokenData } from "@hooks/token/data/use-token-data";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { TokenModel } from "@models/token/token-model";
import { TransactionFeeEstimate } from "@services/transaction-gas/transaction-gas-service";
import { checkGnotPath } from "@utils/common";
import { formatPrice } from "@utils/new-number-utils";
import { formatOrderRate, trimFractionZeros } from "@utils/order-format-utils";
import { getSwapTokenPath } from "@utils/swap-route-utils";
import { makeDisplayTokenAmountString } from "@utils/token-utils";

import { OrderButtonState } from "./use-order-handler.utils";

const COPIED_DURATION = 2_000;

/** Wallet, balance, price and URL helpers shared by the DCA and limit forms. */
export const useOrderFormCommon = (tokenA: TokenModel | null, tokenB: TokenModel | null) => {
  const { connected, isSwitchNetwork, switchNetwork, account } = useWallet();
  const { tokenPrices, displayBalanceStringMap } = useTokenData(true);
  const [copied, setCopied] = useState(false);

  const getUsdPrice = useCallback(
    (token: TokenModel | null): string | null => {
      if (!token) return null;
      return tokenPrices[checkGnotPath(token.priceID)]?.usd ?? tokenPrices[checkGnotPath(token.path)]?.usd ?? null;
    },
    [tokenPrices],
  );

  const tokenABalance = useMemo(() => {
    if (isSwitchNetwork || !tokenA) return "-";
    return displayBalanceStringMap[tokenA.path] ?? displayBalanceStringMap[tokenA.priceID] ?? "-";
  }, [displayBalanceStringMap, isSwitchNetwork, tokenA]);

  const tokenBBalance = useMemo(() => {
    if (isSwitchNetwork || !tokenB) return "-";
    return displayBalanceStringMap[tokenB.path] ?? displayBalanceStringMap[tokenB.priceID] ?? "-";
  }, [displayBalanceStringMap, isSwitchNetwork, tokenB]);

  const isSameToken = useMemo(
    () => !!tokenA && !!tokenB && getSwapTokenPath(tokenA) === getSwapTokenPath(tokenB),
    [tokenA, tokenB],
  );

  const formatUsd = useCallback((value: number | null) => (value === null ? "-" : formatPrice(value)), []);

  const formatRate = useCallback(
    (rate: BigNumber.Value | null) => {
      if (!tokenA || !tokenB || rate === null) return { text: "-", usd: "-" };
      const outputUsd = getUsdPrice(tokenB);
      return {
        text: `1 ${tokenA.displaySymbol} = ${formatOrderRate(rate)} ${tokenB.displaySymbol}`,
        usd: outputUsd === null ? "-" : formatPrice(BigNumber(rate).multipliedBy(outputUsd).toNumber()),
      };
    },
    [getUsdPrice, tokenA, tokenB],
  );

  const formatNetworkFee = useCallback(
    (estimate: TransactionFeeEstimate | null | undefined) => {
      if (!estimate) return { text: "-", usd: "-" };
      const amount = makeDisplayTokenAmountString(GNOT_TOKEN, estimate.total) ?? "0";
      const gnotUsd = getUsdPrice(GNOT_TOKEN);
      return {
        text: `${trimFractionZeros(BigNumber(amount).toFormat(6, BigNumber.ROUND_UP))} ${GNOT_TOKEN.displaySymbol}`,
        usd: gnotUsd === null ? "-" : formatPrice(BigNumber(amount).multipliedBy(gnotUsd).toNumber()),
      };
    },
    [getUsdPrice],
  );

  const copyUrl = useCallback(async (query: Record<string, string | number | null | undefined>) => {
    const params = Object.entries(query)
      .filter(([, value]) => value !== null && value !== undefined && value !== "")
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
    await navigator.clipboard.writeText(`${window.location.host}/swap${params ? `?${params}` : ""}`);
    setCopied(true);
    setTimeout(() => setCopied(false), COPIED_DURATION);
  }, []);

  return {
    connected,
    isSwitchNetwork,
    switchNetwork,
    address: account?.address ?? null,
    copied,
    copyUrl,
    getUsdPrice,
    tokenABalance,
    tokenBBalance,
    isSameToken,
    formatUsd,
    formatRate,
    formatNetworkFee,
  };
};

export function getOrderButtonText(state: OrderButtonState, t: (key: string) => string, placeOrderText: string) {
  switch (state) {
    case "WALLET_LOGIN":
      return t("common:btn.walletLogin");
    case "SWITCH_NETWORK":
      return t("Swap:swapButton.switchNetwork");
    case "ORDER_PAUSED":
      return t("Swap:order.paused");
    case "SELECT_TOKEN":
      return t("Swap:swapButton.selectToken");
    case "ENTER_AMOUNT":
      return t("Swap:swapButton.enterAmount");
    case "INSUFFICIENT_BALANCE":
      return t("common:btn.insuffiBal");
    case "INSUFFICIENT_LIQUIDITY":
      return t("Swap:swapButton.insuffiLiq");
    case "AMOUNT_TOO_LOW":
      return t("Swap:swapButton.amtLow");
    case "PLACE_ORDER":
    default:
      return placeOrderText;
  }
}
