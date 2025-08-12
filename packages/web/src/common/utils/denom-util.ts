import { AmountType, AmountNumberType } from "@common/types/data-prop-types";
import { amountEmptyNumberInit } from "@common/values";
import BigNumber from "bignumber.js";

/**
 * Branded type for minimal denomination (e.g., ugnot)
 * @todo Add factory function with validation to enforce branded type invariants:
 * function toMinimalDenom(s: string): MinimalDenom {
 *   if (!s || typeof s !== "string") throw new Error("Invalid minimal denom");
 *   return s as MinimalDenom;
 * }
 */
type MinimalDenom = string & { __brand: "MinimalDenom" };

/**
 * Branded type for default denomination (e.g., GNOT)
 *
 * @todo Add factory function with validation to enforce branded type invariants:
 * function toDefaultDenom(s: string): DefaultDenom {
 *   if (!s || typeof s !== "string") throw new Error("Invalid default denom");
 *   return s as DefaultDenom;
 * }
 */
type DefaultDenom = string & { __brand: "DefaultDenom" };

/**
 * Amount interface representing a value with denomination
 * @template T - The denomination type (string by default)
 */
interface Amount<T extends string = string> {
  readonly value: BigNumber;
  readonly denom: T;
}

/**
 * Configuration for denomination conversion rates
 */
interface DenomConfig {
  readonly defaultDenom: DefaultDenom; // canonical
  readonly defaultRate: BigNumber;
  readonly minimalDenom: MinimalDenom; // canonical
  readonly minimalRate: BigNumber;
}

/**
 * Type guard to check if an amount is in minimal denomination
 * @param amount - The amount to check
 * @param config - Denomination configuration
 * @returns true if the amount is in minimal denomination
 */
const isMinimalDenom = (amount: Amount, config: DenomConfig): amount is Amount<MinimalDenom> => {
  return amount.denom.toLowerCase() === config.minimalDenom.toLowerCase();
};

/**
 * Type guard to check if an amount is in default denomination
 * @param amount - The amount to check
 * @param config - Denomination configuration
 * @returns true if the amount is in default denomination
 */
const isDefaultDenom = (amount: Amount, config: DenomConfig): amount is Amount<DefaultDenom> => {
  return amount.denom.toUpperCase() === config.defaultDenom.toUpperCase();
};

/**
 * Converts an amount to minimal denomination
 * @param amount - The amount to convert
 * @param denomConfig - Denomination configuration with conversion rates
 * @returns Amount in minimal denomination
 * @example
 * toMinimalDenom({ value: BigNumber(1), denom: "GNOT" }, config)
 * // returns { value: BigNumber(1000000), denom: "ugnot" }
 */
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

/**
 * Converts an amount to default denomination
 * @param amount - The amount to convert
 * @param denomConfig - Denomination configuration with conversion rates
 * @returns Amount in default denomination
 * @example
 * toDefaultDenom({ value: BigNumber(1000000), denom: "ugnot" }, config)
 * // returns { value: BigNumber(1), denom: "GNOT" }
 */
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

/**
 * Result of parsing an amount text string
 */
interface ParsedAmount {
  readonly amount: number;
  readonly currency: string;
}

/**
 * Parses amount text into amount and currency components
 * @param text - The text to parse (e.g., "100 GNOT")
 * @returns Parsed amount with currency or null if invalid
 */
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

/**
 * Parses balance text string into array of amounts
 * @param balancesText - Comma-separated balance text (e.g., "100 GNOT, 50 ATOM")
 * @returns Array of parsed amounts
 * @example
 * textToBalances("100 GNOT, 50 ATOM")
 * // returns [{ amount: 100, currency: "GNOT" }, { amount: 50, currency: "ATOM" }]
 */
export const textToBalances = (balancesText: string): ParsedAmount[] => {
  if (!balancesText.trim()) {
    return [amountEmptyNumberInit];
  }

  const balanceTexts = balancesText.split(",");
  const balances = balanceTexts.map(parseAmountText).filter((balance): balance is ParsedAmount => balance !== null);

  return balances.length > 0 ? balances : [amountEmptyNumberInit];
};

/**
 * Converts amount format to BigNumber format
 * @param amount - Amount in number or string format
 * @returns Amount with BigNumber value
 * @example
 * amountFormatToBignum({ value: "100", denom: "GNOT" })
 * // returns { value: BigNumber(100), denom: "GNOT" }
 */
export function amountFormatToBignum(amount: AmountNumberType): Amount;
export function amountFormatToBignum(amount: AmountType): Amount;
export function amountFormatToBignum(amount: AmountNumberType | AmountType): Amount {
  return {
    value: BigNumber(amount.value),
    denom: amount.denom,
  };
}

/**
 * Convenience alias to express an {@link Amount} with a specific denom literal/brand.
 */
export type AmountOf<D extends string = string> = Amount<D>;

/**
 * Creates a value-only transformer for {@link Amount}.
 *
 * The returned function:
 * - is **pure** and does not mutate the input object
 * - preserves the original `denom` (including its literal/brand type) and other fields
 * - keeps the generic denom type parameter `D` end-to-end (e.g. `Amount<"GNOT">` stays `Amount<"GNOT">`)
 *
 * @typeParam D - Denomination literal/brand carried by the input amount.
 * @typeParam T - Concrete amount shape extending {@link AmountOf} for `D`.
 * @param operation - Mapping from the current {@link BigNumber} value to a new one.
 *   Should be side-effect free; may apply scaling, fees, rounding, etc.
 * @returns Transformer `(amount: T) => T` that applies `operation` to `amount.value`
 *   while leaving `denom` untouched.
 *
 * @example
 * // Multiply by 2, preserving denom and its literal type.
 * const doubleAmount = createAmountTransformer<"GNOT", Amount<"GNOT">>(v => v.multipliedBy(2));
 * const a = { value: new BigNumber(10), denom: "GNOT" as const };
 * const r = doubleAmount(a); // { value: BigNumber(20), denom: "GNOT" }
 *
 * @example
 * // With branded denoms
 * type DefaultDenom = string & { __brand: "DefaultDenom" };
 * const half = createAmountTransformer<DefaultDenom, Amount<DefaultDenom>>(v => v.dividedBy(2));
 *
 * @example
 * // Composing transformers
 * const addFee = createAmountTransformer(v => v.plus(0.1));
 * const roundDown2 = createAmountTransformer(v => v.decimalPlaces(2, BigNumber.ROUND_DOWN));
 * const out = roundDown2(addFee(a));
 */
export const createAmountTransformer =
  <D extends string, T extends AmountOf<D>>(operation: (value: BigNumber) => BigNumber) =>
  (amount: T): T => ({ ...amount, value: operation(amount.value) });

/**
 * Doubles an amount value
 * @param amount - The amount to double
 * @returns Amount with doubled value
 */
export const doubleAmount = createAmountTransformer(value => value.multipliedBy(2));

/**
 * Halves an amount value
 * @param amount - The amount to halve
 * @returns Amount with halved value
 */
export const halveAmount = createAmountTransformer(value => value.dividedBy(2));

/**
 * Compares two amounts with the same denomination
 * @param a - First amount
 * @param b - Second amount
 * @returns -1 if a < b, 0 if a == b, 1 if a > b
 * @throws Error if denominations don't match
 * @example
 * compareAmounts(
 *   { value: BigNumber(10), denom: "GNOT" },
 *   { value: BigNumber(20), denom: "GNOT" }
 * ) // returns -1
 */
export const compareAmounts = (a: Amount, b: Amount): -1 | 0 | 1 => {
  if (a.denom !== b.denom) {
    throw new Error(`Cannot compare amounts with different denoms: ${a.denom} vs ${b.denom}`);
  }

  return a.value.comparedTo(b.value) as -1 | 0 | 1;
};

/**
 * Result of amount validation
 */
interface AmountValidation {
  readonly isValid: boolean;
  readonly errors?: string[];
}

/**
 * Validates an amount for correctness
 * @param amount - The amount to validate
 * @returns Validation result with error details if invalid
 * @example
 * validateAmount({ value: BigNumber(100), denom: "GNOT" })
 * // returns { isValid: true }
 * validateAmount({ value: BigNumber(-10), denom: "GNOT" })
 * // returns { isValid: false, errors: ["Amount cannot be negative"] }
 */
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
