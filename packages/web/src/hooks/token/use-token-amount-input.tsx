import { TokenModel } from "@models/token/token-model";
import BigNumber from "bignumber.js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTokenData } from "./use-token-data";
import { convertLargePrice } from "@utils/stake-position-utils";
import { checkGnotPath } from "@utils/common";

export interface TokenAmountInputModel {
  token: TokenModel | null;
  amount: string;
  balance: string;
  usdValue: string;
  changeAmount: (amount: string) => void;
}

export const useTokenAmountInput = (token: TokenModel | null): TokenAmountInputModel => {
  const [amount, setAmount] = useState<string>("0");
  const [balance, setBalance] = useState<string>("0");
  const [usd, setUSD] = useState<number>();
  const { displayBalanceMap, tokenPrices } = useTokenData();

  useEffect(() => {
    if (token && displayBalanceMap[token.priceId]) {
      const balance = displayBalanceMap[token.priceId];
      setBalance(BigNumber(balance ?? 0).toFormat());
    } else {
      setBalance("0");
    }
  }, [displayBalanceMap, token]);

  const usdValue = useMemo(() => {
    if (!usd || !(Number(amount))) {
      return "-";
    }
    return `$${convertLargePrice(usd.toString())}`;
  }, [usd, amount]);

  const changeAmount = useCallback((value: string) => {
    if (!token) {
      return;
    }
    const amount = BigNumber(value);
    if (amount.isNaN() || !amount.isFinite()) {
      setAmount("0");
      return;
    }
    setAmount(amount.toString());

    if (tokenPrices[checkGnotPath(token.priceId)]) {
      const usd = BigNumber(tokenPrices[checkGnotPath(token.priceId)].usd).multipliedBy(value.toString()).toNumber();
      setUSD(usd);
    }
  }, [token, tokenPrices]);

  return {
    token,
    amount,
    balance,
    usdValue,
    changeAmount,
  };
};