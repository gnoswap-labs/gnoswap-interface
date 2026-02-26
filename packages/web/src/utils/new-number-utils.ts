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

/**
 * Resolved minimum limit threshold used by formatting functions to determine
 * when a value should be displayed as `<threshold` instead of the actual amount.
 */
interface ResolvedMinLimit {
  /** BigNumber instance for precise comparison (e.g. `bigNum.isLessThan(value)`). */
  value: BigNumber;
  /**
   * Fixed-point string for user-facing display (e.g. `"0.000000000000000001"`).
   * Uses `toFixed()` instead of `toString()` to avoid exponential notation
   * like `"1e-18"` that BigNumber's default stringification can produce.
   */
  display: string;
}

/**
 * Resolves the minimum displayable limit from either an explicit `minLimit`
 * or the number of `decimals`.
 *
 * Uses BigNumber arithmetic (`1 / 10^decimals`) instead of JavaScript's
 * `Math.pow` to avoid IEEE 754 floating-point precision loss that occurs
 * with large exponents (e.g. `1 / Math.pow(10, 18)` yields `1e-18` which
 * cannot represent all intermediate values exactly).
 *
 * @param minLimit - Explicit threshold provided by the caller. When present
 *   (including `0`), it takes precedence over the decimals-derived value.
 * @param decimals - Number of decimal places. When `minLimit` is absent,
 *   the threshold is computed as `10^(-decimals)`.
 * @returns A {@link ResolvedMinLimit} with both comparison and display forms,
 *   or `null` when neither `minLimit` nor `decimals` is provided.
 */
const resolveMinLimit = (minLimit: number | null | undefined, decimals?: number): ResolvedMinLimit | null => {
  if (minLimit != null) {
    const value = BigNumber(minLimit);
    return { value, display: value.toFixed() };
  }
  if (decimals != null) {
    const value = BigNumber(1).div(BigNumber(10).pow(decimals));
    return { value, display: value.toFixed(decimals) };
  }
  return null;
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

  if (hasMinLimit && internalMinLimit && bigNum.isLessThan(internalMinLimit.value) && bigNum.isGreaterThan(0)) {
    return `<${internalMinLimit.display}`;
  }

  if (isKMB) {
    const kmbNumber = toKMBFormat(raw);
    if (kmbNumber) return kmbNumber;
  }

  const stringValue = decimals != null
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

  if (internalMinLimit && bigNum.isLessThan(internalMinLimit.value) && bigNum.isGreaterThan(0)) {
    return `<${internalMinLimit.display}%`;
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

  if (internalMinLimit && bigNum.isLessThan(internalMinLimit.value) && bigNum.isGreaterThan(0)) {
    return `<${internalMinLimit.display}${internalSuffix}`;
  }

  if (isKMB) {
    const kmbNumber = toKMBFormat(bigNum);
    if (kmbNumber) return kmbNumber;
  }

  if (decimals != null) {
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

  if (hasMinLimit && resolvedMinLimit && bigNum.isLessThan(resolvedMinLimit.value) && bigNum.isGreaterThan(0)) {
    return `<${prefix}${resolvedMinLimit.display}`;
  }

  if (isKMB) {
    const kmbNumber = toKMBFormat(raw, { usd });
    if (kmbNumber) return kmbNumber;
  }

  const formatted = removeTrailingZeros(absValue.toFormat(decimals, BigNumber.ROUND_DOWN));
  const sign = formatted === "0" ? "" : negativeSign;

  return sign + prefix + formatted;
};
