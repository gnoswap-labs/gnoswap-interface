import { AmountType } from "@common/types/data-prop-types";
import { AmountNumberType } from "@common/types/data-prop-types";
import { amountEmptyNumberInit } from "@common/values";
import BigNumber from "bignumber.js";

interface Amount {
  value: BigNumber;
  denom: string;
}

interface DenomConfig {
  defaultDenom: string;
  defaultRate: BigNumber;
  minimalDenom: string;
  minimalRate: BigNumber;
}

export const toMinimalDenom = (amount: Amount, denomConfig: DenomConfig) => {
  const { defaultRate, minimalDenom, minimalRate } = denomConfig;
  if (isMinimalDenom(amount, denomConfig)) {
    return amount;
  }
  const amountValue = amount.value;
  const rate = defaultRate.dividedBy(minimalRate);
  const minimalAmount = amountValue.multipliedBy(rate);
  return {
    value: minimalAmount,
    denom: minimalDenom,
  };
};

export const toDefaultDenom = (amount: Amount, denomConfig: DenomConfig) => {
  const { defaultRate, defaultDenom, minimalRate } = denomConfig;
  if (isDefaultDenom(amount, denomConfig)) {
    return amount;
  }
  const amountValue = amount.value;
  const rate = minimalRate.dividedBy(defaultRate);
  const defaultAmount = amountValue.multipliedBy(rate);
  return {
    value: defaultAmount,
    denom: defaultDenom,
  };
};

export const textToBalances = (balancesText: string) => {
  const balanceTexts = balancesText.split(",");
  if (balanceTexts.length === 0) {
    return [amountEmptyNumberInit];
  }
  const balances = balanceTexts.map(convertTextToAmount);
  return balances;
};

const isMinimalDenom = (amount: Amount, denomConfig: DenomConfig) => {
  const denom = amount.denom;
  return denom.toLowerCase() === denomConfig.minimalDenom.toLowerCase();
};

const isDefaultDenom = (amount: Amount, denomConfig: DenomConfig) => {
  const denom = amount.denom;
  return denom.toUpperCase() === denomConfig.defaultDenom.toUpperCase();
};

const convertTextToAmount = (text: string) => {
  const balance = text
    .trim()
    .replace("\"", "")
    .match(/[a-zA-Z]+|[0-9]+(?:\.[0-9]+|)/g);

  const amount = balance && balance?.length > 0 ? balance[0] : 0.0;
  const currency = balance && balance?.length > 1 ? balance[1] : "";
  return { amount: BigNumber(amount).toNumber(), currency };
};

export const amountFormatToBignum = (amount: AmountNumberType | AmountType) => {
  return {
    value: BigNumber(amount.value),
    denom: amount.denom,
  };
};
