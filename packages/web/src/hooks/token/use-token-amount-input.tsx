import { TokenModel } from "@models/token/token-model";
import BigNumber from "bignumber.js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTokenData } from "./use-token-data";
import { checkGnotPath } from "@utils/common";
import { toPriceFormatNotRounding } from "@utils/number-utils";

export interface TokenAmountInputModel {
  token: TokenModel | null;
  amount: string;
  balance: string;
  usdValue: string;
  changeAmount: (amount: string) => void;
}

function handleAmount(changed: string, token: TokenModel | null) {
  let value = changed;
  const decimals = token?.decimals || 0;
  if (!value || BigNumber(value).isZero()) {
    value = changed;
  } else {
    value = BigNumber(value).toFixed(decimals || 0, 1);
  }

  if (BigNumber(changed).isEqualTo(value)) {
    const dotIndex = changed.indexOf(".");
    if (dotIndex === -1 || changed.length - dotIndex - 1 < decimals) {
      value = changed;
    }
  }

  return value;
}

export const useTokenAmountInput = (
  token: TokenModel | null,
): TokenAmountInputModel => {
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

    return toPriceFormatNotRounding(usd, {
      isKMBFormat: false,
      lessThan1Significant: 2,
      greaterThan1Decimals: 2,
      fixedGreaterThan1: true,
      fixedLessThan1: true,
      usd: true,
    });
  }, [tokenPrices, amount, token]);

  const changeAmount = useCallback(
    (value: string) => {
      if (!token) {
        return;
      }

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

  return {
    token,
    amount,
    balance,
    usdValue,
    changeAmount,
  };
};
