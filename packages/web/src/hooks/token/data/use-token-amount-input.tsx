import { useCallback, useEffect, useMemo, useState } from "react";
import BigNumber from "bignumber.js";

import { TokenModel } from "@models/token/token-model";
import { useTokenData } from "./use-token-data";
import { checkGnotPath } from "@utils/common";
import { formatPrice } from "@utils/new-number-utils";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { useTranslation } from "react-i18next";

type DelegateButtonStateType =
  | "WALLET_LOGIN"
  | "SWITCH_NETWORK"
  | "ENTER_AMOUNT"
  | "AMOUNT_TOO_LOW"
  | "INSUFFICIENT_BALANCE"
  | "DELEGATE";

export interface TokenAmountInputModel {
  token: TokenModel | null;
  amount: string;
  balance: string;
  usdValue: string;
  changeAmount: (amount: string) => void;
  delegateButtonState: string;
  delegateButtonText: string;
  isAvailableDelegate: boolean;
}

const DELEGATE_MIN_AMOUNT = 1;

function handleAmount(changed: string, token: TokenModel | null) {
  let value = changed;
  const decimals = token?.decimals;

  if (decimals === undefined) {
    return changed;
  }

  if (!value || BigNumber(value).isZero()) {
    value = changed;
  } else {
    value = BigNumber(value).toFixed(decimals, 1);
  }

  if (BigNumber(changed).isEqualTo(value)) {
    const dotIndex = changed.indexOf(".");
    if (dotIndex === -1 || changed.length - dotIndex - 1 < decimals) {
      value = changed;
    }
  }

  return value;
}

function compareAmountFn(amountA: string | number | bigint, amountB: string | number | bigint) {
  const amountValueA = BigNumber(`${amountA}`.replace(/,/g, ""));
  const amountValueB = BigNumber(`${amountB}`.replace(/,/g, ""));

  if (amountValueA.isEqualTo(amountValueB)) {
    return 0;
  }

  return amountValueA.isGreaterThan(amountValueB) ? 1 : -1;
}

export const useTokenAmountInput = (token: TokenModel | null): TokenAmountInputModel => {
  const { t } = useTranslation();
  const { connected: isConnectedWallet, isSwitchNetwork } = useWallet();

  const [amount, setAmount] = useState<string>("0");
  const [balance, setBalance] = useState<string>("0");
  const { displayBalanceMap, tokenPrices } = useTokenData();

  useEffect(() => {
    if (token && displayBalanceMap[token.path]) {
      const balance = displayBalanceMap[token.path];
      setBalance(BigNumber(balance ?? 0).toFormat());
    } else {
      setBalance("0");
    }
  }, [displayBalanceMap, token]);

  const usdValue = useMemo(() => {
    if (!tokenPrices || !Number(amount) || !token) {
      return "-";
    }

    const usd = BigNumber(tokenPrices[checkGnotPath(token.path)]?.usd ?? 0)
      .multipliedBy(amount)
      .toNumber();

    if (!tokenPrices[checkGnotPath(token.path)]?.usd) return "-";

    return formatPrice(usd, { usd: true, isKMB: false, approx: true });
  }, [tokenPrices, amount, token]);

  const changeAmount = useCallback(
    (value: string) => {
      if (/^0\.0(?:0*)$/.test(value)) {
        setAmount(value);
        return;
      }

      const amount = BigNumber(value);
      if (amount.isNaN() || !amount.isFinite()) {
        setAmount("0");
        return;
      }

      const result = handleAmount(value, token);

      setAmount(result);
    },
    [token],
  );

  const delegateButtonState: DelegateButtonStateType = useMemo(() => {
    if (!isConnectedWallet) {
      return "WALLET_LOGIN";
    }
    if (isSwitchNetwork) {
      return "SWITCH_NETWORK";
    }
    if (!Number(amount)) {
      return "ENTER_AMOUNT";
    }
    if (compareAmountFn(amount, balance) > 0) {
      return "INSUFFICIENT_BALANCE";
    }
    if (compareAmountFn(DELEGATE_MIN_AMOUNT, amount) > 0) {
      return "AMOUNT_TOO_LOW";
    }
    return "DELEGATE";
  }, [isConnectedWallet, isSwitchNetwork, amount, balance]);

  const delegateButtonText = useMemo(() => {
    switch (delegateButtonState) {
      case "WALLET_LOGIN":
        return t("common:btn.walletLogin");
      case "SWITCH_NETWORK":
        return t("Swap:swapButton.switchNetwork");
      case "ENTER_AMOUNT":
        return t("common:btn.enterAmount");
      case "INSUFFICIENT_BALANCE":
        return t("common:btn.insuffiBal");
      case "AMOUNT_TOO_LOW":
        return t("common:btn.amountTooLow");
      case "DELEGATE":
      default:
        return t("Governance:myDel.delModal.ctaBtn");
    }
  }, [delegateButtonState, t]);

  const isAvailableDelegate = useMemo(() => {
    return ["DELEGATE"].includes(delegateButtonState);
  }, [delegateButtonState]);

  return {
    token,
    amount,
    balance,
    usdValue,
    changeAmount,
    delegateButtonState,
    delegateButtonText,
    isAvailableDelegate,
  };
};
