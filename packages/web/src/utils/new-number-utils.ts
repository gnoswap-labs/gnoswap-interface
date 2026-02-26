import BigNumber from "bignumber.js";
import { buildPricePrefix } from "./common";
import { toKMBFormat } from "./number-utils";

export const removeTrailingZeros = (value: string) => {
  if (!value.includes(".")) return value;
  return value.replace(/0+$/, "").replace(/\.$/, "");
};

type NumericInput = string | number | BigNumber | null | undefined;

interface ParsedBigNumber {
  bigNum: BigNumber;
  raw: string;
}

/**
 * Parses a numeric input into a BigNumber, stripping commas and validating.
 * Returns null for empty, null, undefined, or NaN inputs.
 */
const parseToBigNumber = (value: NumericInput): ParsedBigNumber | null => {
  if (value === "" || value === null || value === undefined) return null;
  const raw = value.toString().replace(/,/g, "");
  const bigNum = BigNumber(raw);
  if (bigNum.isNaN()) return null;
  return { bigNum, raw };
};

const resolveMinLimit = (minLimit: number | null | undefined, decimals?: number): number | null => {
  return minLimit ?? (decimals ? 1 / Math.pow(10, decimals) : null);
};

export const formatPoolPairAmount = (
  amount?: NumericInput,
  {
    decimals,
    minLimit = 0.01,
    isKMB = true,
    hasMinLimit = true,
  }: {
    decimals?: number;
    minLimit?: number | null;
    isKMB?: boolean;
    hasMinLimit?: boolean;
  } = {},
) => {
  const parsed = parseToBigNumber(amount);
  if (!parsed) return "-";
  const { bigNum, raw } = parsed;

  if (bigNum.isEqualTo(0)) return "0";

  const internalMinLimit = resolveMinLimit(minLimit, decimals);

  if (hasMinLimit && internalMinLimit && bigNum.isLessThan(internalMinLimit) && bigNum.isGreaterThan(0)) {
    return `<${internalMinLimit}`;
  }

  if (isKMB) {
    const kmbNumber = toKMBFormat(raw);
    if (kmbNumber) return kmbNumber;
  }

  const stringValue = decimals
    ? bigNum.toFormat(decimals, BigNumber.ROUND_DOWN)
    : bigNum.toFormat();

  return removeTrailingZeros(stringValue);
};

export const formatRate = (
  amount?: NumericInput,
  {
    decimals = 2,
    minLimit,
    showSign = false,
    allowZeroDecimals = false,
  }: {
    decimals?: number;
    minLimit?: number | null;
    showSign?: boolean;
    allowZeroDecimals?: boolean;
  } = {},
) => {
  const parsed = parseToBigNumber(amount);
  if (!parsed) return "-";
  const { bigNum } = parsed;

  const sign = showSign && !bigNum.isEqualTo(0)
    ? (bigNum.isLessThan(0) ? "-" : "+")
    : "";

  const internalMinLimit = resolveMinLimit(minLimit, decimals);

  if (!allowZeroDecimals && bigNum.isEqualTo(0)) {
    return "0%";
  }

  if (internalMinLimit && bigNum.isLessThan(internalMinLimit) && bigNum.isGreaterThan(0)) {
    return `<${internalMinLimit}%`;
  }

  return sign + bigNum.abs().toFormat(decimals, BigNumber.ROUND_DOWN) + "%";
};

export const formatTokenAmount = (
  amount: NumericInput,
  {
    decimals,
    minLimit,
    isKMB = true,
    suffix,
  }: {
    decimals?: number;
    minLimit?: number | null;
    isKMB?: boolean;
    suffix?: string;
  } = {},
) => {
  if (amount === "" || amount === null || amount === undefined) {
    return "-";
  }

  const parsed = parseToBigNumber(amount);
  const internalSuffix = suffix ? " " + suffix : "";

  if (!parsed) return amount?.toString() ?? "-";

  const { bigNum } = parsed;

  if (bigNum.isEqualTo(0)) return "0" + internalSuffix;

  const internalMinLimit = resolveMinLimit(minLimit, decimals);

  if (internalMinLimit && bigNum.isLessThan(internalMinLimit) && bigNum.isGreaterThan(0)) {
    return `<${internalMinLimit}${internalSuffix}`;
  }

  if (isKMB) {
    const kmbNumber = toKMBFormat(bigNum);
    if (kmbNumber) return kmbNumber;
  }

  if (decimals) {
    return `${bigNum.toFormat(decimals, BigNumber.ROUND_DOWN)}${internalSuffix}`;
  }

  return `${bigNum.toFormat()}${internalSuffix}`;
};

interface FormatPriceOptions {
  usd?: boolean;
  isKMB?: boolean;
  lessThan1Significant?: number;
  greaterThan1Decimals?: number;
  forcedDecimals?: boolean;
  approx?: boolean;
}

export const formatPrice = (value?: NumericInput, options: FormatPriceOptions = {}): string => {
  const {
    isKMB = true,
    usd = true,
    approx = false,
    lessThan1Significant = 3,
    greaterThan1Decimals = 2,
    forcedDecimals = false,
  } = options;

  if (value === "" || value === null || value === undefined) {
    return "-";
  }

  const parsed = parseToBigNumber(value);
  if (!parsed) return value.toString();

  const { bigNum, raw } = parsed;
  const absValue = bigNum.abs();
  const prefix = buildPricePrefix({ usd, approx });
  const negativeSign = bigNum.isLessThan(0) ? "-" : "";

  if (absValue.isEqualTo(0)) return prefix + "0";

  if (isKMB) {
    const kmbNumber = toKMBFormat(raw, { usd });
    if (kmbNumber) return kmbNumber;
  }

  if (absValue.isLessThan(1)) {
    const tempNum = bigNum.toPrecision(lessThan1Significant, BigNumber.ROUND_DOWN);
    return `${negativeSign}${prefix}${tempNum}`;
  }

  const formattedNumber = bigNum.toFormat(greaterThan1Decimals, BigNumber.ROUND_DOWN);
  return `${negativeSign}${prefix}${
    forcedDecimals ? formattedNumber : removeTrailingZeros(formattedNumber)
  }`;
};

export const formatOtherPrice = (
  value?: NumericInput,
  {
    usd = true,
    isKMB = true,
    decimals = 2,
    hasMinLimit = true,
    minLimit,
    zeroAsEmpty = false,
  }: {
    usd?: boolean;
    isKMB?: boolean;
    decimals?: number;
    hasMinLimit?: boolean;
    minLimit?: number;
    zeroAsEmpty?: boolean;
  } = {},
): string => {
  const parsed = parseToBigNumber(value);
  if (!parsed) return "-";

  const { bigNum, raw } = parsed;
  const absValue = bigNum.abs();
  const prefix = usd ? "$" : "";
  const negativeSign = bigNum.isLessThan(0) ? "-" : "";

  if (absValue.isEqualTo(0)) {
    if (zeroAsEmpty) return "-";
    return prefix + "0";
  }

  const resolvedMinLimit = resolveMinLimit(minLimit, decimals);

  if (hasMinLimit && resolvedMinLimit && bigNum.isLessThan(resolvedMinLimit) && bigNum.isGreaterThan(0)) {
    return `<${prefix}${resolvedMinLimit}`;
  }

  if (isKMB) {
    const kmbNumber = toKMBFormat(raw, { usd });
    if (kmbNumber) return kmbNumber;
  }

  const formatted = removeTrailingZeros(absValue.toFormat(decimals, BigNumber.ROUND_DOWN));
  const sign = formatted === "0" ? "" : negativeSign;

  return sign + prefix + formatted;
};
