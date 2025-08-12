import { AmountType, AmountNumberType } from "@common/types/data-prop-types";
import { amountEmptyNumberInit } from "@common/values";
import BigNumber from "bignumber.js";

// Branded types for type safety
type MinimalDenom = string & { __brand: "MinimalDenom" };
type DefaultDenom = string & { __brand: "DefaultDenom" };

// Improved Amount interface with branded types
interface Amount<T extends string = string> {
  readonly value: BigNumber;
  readonly denom: T;
}

// Type-safe denom configuration
interface DenomConfig {
  readonly defaultDenom: DefaultDenom;
  readonly defaultRate: BigNumber;
  readonly minimalDenom: MinimalDenom;
  readonly minimalRate: BigNumber;
}

// Type guards with proper type predicates
const isMinimalDenom = (amount: Amount, config: DenomConfig): amount is Amount<MinimalDenom> => {
  return amount.denom.toLowerCase() === config.minimalDenom.toLowerCase();
};

const isDefaultDenom = (amount: Amount, config: DenomConfig): amount is Amount<DefaultDenom> => {
  return amount.denom.toUpperCase() === config.defaultDenom.toUpperCase();
};

// Type-safe conversion with conditional types
export const toMinimalDenom = <T extends Amount>(amount: T, denomConfig: DenomConfig): Amount<MinimalDenom> => {
  if (isMinimalDenom(amount, denomConfig)) {
    return amount;
  }

  // Note: The rate calculation seems inverted but matches original implementation
  const rate = denomConfig.minimalRate.dividedBy(denomConfig.defaultRate);
  const minimalAmount = amount.value.multipliedBy(rate);

  return {
    value: minimalAmount,
    denom: denomConfig.minimalDenom,
  };
};

export const toDefaultDenom = <T extends Amount>(amount: T, denomConfig: DenomConfig): Amount<DefaultDenom> => {
  if (isDefaultDenom(amount, denomConfig)) {
    return amount;
  }

  // Note: The rate calculation seems inverted but matches original implementation
  const rate = denomConfig.defaultRate.dividedBy(denomConfig.minimalRate);
  const defaultAmount = amount.value.multipliedBy(rate);

  return {
    value: defaultAmount,
    denom: denomConfig.defaultDenom,
  };
};

// Result type for parsed amounts
interface ParsedAmount {
  readonly amount: number;
  readonly currency: string;
}

// Type-safe text parsing with validation
const parseAmountText = (text: string): ParsedAmount | null => {
  const trimmedText = text.trim().replace(/"/g, "");
  const matches = trimmedText.match(/([0-9]+(?:\.[0-9]+)?)\s*([a-zA-Z]+)?/);

  if (!matches) {
    return null;
  }

  const [, amountStr, currency = ""] = matches;
  const amount = parseFloat(amountStr);

  if (isNaN(amount)) {
    return null;
  }

  return { amount, currency };
};

// Enhanced balance parsing with error handling
export const textToBalances = (balancesText: string): ParsedAmount[] => {
  if (!balancesText.trim()) {
    return [amountEmptyNumberInit];
  }

  const balanceTexts = balancesText.split(",");
  const balances = balanceTexts.map(parseAmountText).filter((balance): balance is ParsedAmount => balance !== null);

  return balances.length > 0 ? balances : [amountEmptyNumberInit];
};

// Type-safe amount formatting with overloads
export function amountFormatToBignum(amount: AmountNumberType): Amount;
export function amountFormatToBignum(amount: AmountType): Amount;
export function amountFormatToBignum(amount: AmountNumberType | AmountType): Amount {
  return {
    value: BigNumber(amount.value),
    denom: amount.denom,
  };
}

// Utility type for amount operations
type AmountOperation<T extends Amount = Amount> = (amount: T) => T;

// Higher-order function for amount transformations
export const createAmountTransformer = <T extends Amount>(
  operation: (value: BigNumber) => BigNumber,
): AmountOperation<T> => {
  return (amount: T): T => ({
    ...amount,
    value: operation(amount.value),
  });
};

// Example transformers
export const doubleAmount = createAmountTransformer(value => value.multipliedBy(2));

export const halveAmount = createAmountTransformer(value => value.dividedBy(2));

// Type-safe amount comparison
export const compareAmounts = (a: Amount, b: Amount): -1 | 0 | 1 => {
  if (a.denom !== b.denom) {
    throw new Error(`Cannot compare amounts with different denoms: ${a.denom} vs ${b.denom}`);
  }

  return a.value.comparedTo(b.value) as -1 | 0 | 1;
};

// Validation result type
interface AmountValidation {
  readonly isValid: boolean;
  readonly errors?: string[];
}

// Amount validation with detailed errors
export const validateAmount = (amount: Amount): AmountValidation => {
  const errors: string[] = [];

  if (!amount.denom) {
    errors.push("Denom is required");
  }

  if (!amount.value || amount.value.isNaN()) {
    errors.push("Invalid amount value");
  }

  if (amount.value && amount.value.isNegative()) {
    errors.push("Amount cannot be negative");
  }

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
};

