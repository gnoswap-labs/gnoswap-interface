import { TokenDefaultModel } from "@models/token/token-default-model";
import BigNumber from "bignumber.js";
import { useCallback, useMemo, useState } from "react";

export interface TokenAmountInputModel {
  token: TokenDefaultModel | undefined;
  amount: string;
  balance: string;
  usdValue: string;
  changeAmount: (amount: string) => void;
  changeBalance: (balance: number) => void;
}

export const useTokenAmountInput = (token: TokenDefaultModel | undefined): TokenAmountInputModel => {
  const [amount, setAmount] = useState<string>("0");
  const [balance, setBalance] = useState<string>("0");
  const [usd, setUSD] = useState<number>();

  const usdValue = useMemo(() => {
    if (!usd) {
      return "-";
    }
    return `$ ${usd}`;
  }, [usd]);

  const changeAmount = useCallback((value: string) => {
    const amount = value;
    setAmount(amount);
    setUSD(BigNumber(amount).toNumber());
  }, []);

  const changeBalance = useCallback((balance: number) => {
    setBalance(BigNumber(balance).toFormat());
  }, []);

  return {
    token,
    amount,
    balance,
    usdValue,
    changeBalance,
    changeAmount,
  };
};