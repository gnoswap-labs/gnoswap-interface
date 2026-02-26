import BigNumber from "bignumber.js";
import { buildPricePrefix } from "./common";
import { toKMBFormat } from "./number-utils";

export const removeTrailingZeros = (value: string) => {
  if (!value.includes(".")) return value;
  return value.replace(/0+$/, "").replace(/\.$/, "");
};

type NumericInput = string | number | BigNumber | null | undefined;

/**
 * Result of parsing a {@link NumericInput} into a validated BigNumber.
 * Provides the original value, its absolute value, and the sanitized
 * string form so that callers never need to re-parse or re-strip commas.
 */
interface ParsedBigNumber {
  /** The parsed value with its original sign preserved. */
  bigNum: BigNumber;
  /** Pre-computed absolute value (`bigNum.abs()`), used for formatting and comparison. */
  abs: BigNumber;
  /** Comma-stripped string form of the input, suitable for passing to `toKMBFormat` etc. */
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
  return { bigNum, abs: bigNum.abs(), raw };
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

/**
 * Determines the sign prefix for a formatted number.
 *
 * The sign is derived from the original value but suppressed when the
 * formatted absolute value is "0" (i.e. a very small negative that
 * rounds to zero should not display as "-$0").
 *
 * @param bigNum - The original parsed BigNumber (may be negative).
 * @param formattedAbs - The formatted absolute value string (e.g. "1,234.56" or "0").
 * @param showSign - When true, positive values get a "+" prefix.
 */
const resolveSign = (bigNum: BigNumber, formattedAbs: string, showSign = false): string => {
  if (formattedAbs === "0") return "";
  if (bigNum.isNegative()) return "-";
  if (showSign) return "+";
  return "";
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
  const { bigNum, abs } = parsed;

  if (abs.isEqualTo(0)) return "0";

  const internalMinLimit = resolveMinLimit(minLimit, decimals);

  if (hasMinLimit && internalMinLimit && abs.isLessThan(internalMinLimit.value) && bigNum.isGreaterThan(0)) {
    return `<${internalMinLimit.display}`;
  }

  if (isKMB) {
    const kmbNumber = toKMBFormat(abs);
    if (kmbNumber) return kmbNumber;
  }

  const formatted = decimals != null ? abs.toFormat(decimals, BigNumber.ROUND_DOWN) : abs.toFormat();
  const cleaned = removeTrailingZeros(formatted);
  const sign = resolveSign(bigNum, cleaned);

  return sign + cleaned;
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
  const { bigNum, abs } = parsed;

  if (!allowZeroDecimals && abs.isEqualTo(0)) {
    return "0%";
  }

  const internalMinLimit = resolveMinLimit(minLimit, decimals);

  if (internalMinLimit && abs.isLessThan(internalMinLimit.value) && bigNum.isGreaterThan(0)) {
    return `<${internalMinLimit.display}%`;
  }

  const formatted = abs.toFormat(decimals, BigNumber.ROUND_DOWN);
  const sign = resolveSign(bigNum, formatted, showSign);

  return sign + formatted + "%";
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

  const { bigNum, abs } = parsed;

  if (abs.isEqualTo(0)) return "0" + internalSuffix;

  const internalMinLimit = resolveMinLimit(minLimit, decimals);

  if (internalMinLimit && abs.isLessThan(internalMinLimit.value) && bigNum.isGreaterThan(0)) {
    return `<${internalMinLimit.display}${internalSuffix}`;
  }

  if (isKMB) {
    const kmbNumber = toKMBFormat(abs);
    if (kmbNumber) return kmbNumber;
  }

  const formatted = decimals != null ? abs.toFormat(decimals, BigNumber.ROUND_DOWN) : abs.toFormat();
  const sign = resolveSign(bigNum, formatted);

  return `${sign}${formatted}${internalSuffix}`;
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

  const { bigNum, abs } = parsed;
  const prefix = buildPricePrefix({ usd, approx });

  if (abs.isEqualTo(0)) return prefix + "0";

  if (isKMB) {
    const kmbNumber = toKMBFormat(abs, { usd });
    if (kmbNumber) return kmbNumber;
  }

  if (abs.isLessThan(1)) {
    const formatted = abs.toPrecision(lessThan1Significant, BigNumber.ROUND_DOWN);
    const sign = resolveSign(bigNum, formatted);
    return `${sign}${prefix}${formatted}`;
  }

  const formatted = abs.toFormat(greaterThan1Decimals, BigNumber.ROUND_DOWN);
  const cleaned = forcedDecimals ? formatted : removeTrailingZeros(formatted);
  const sign = resolveSign(bigNum, cleaned);

  return `${sign}${prefix}${cleaned}`;
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

  const { bigNum, abs } = parsed;
  const prefix = usd ? "$" : "";

  if (abs.isEqualTo(0)) {
    if (zeroAsEmpty) return "-";
    return prefix + "0";
  }

  const resolvedMinLimit = resolveMinLimit(minLimit, decimals);

  if (hasMinLimit && resolvedMinLimit && abs.isLessThan(resolvedMinLimit.value) && bigNum.isGreaterThan(0)) {
    return `<${prefix}${resolvedMinLimit.display}`;
  }

  if (isKMB) {
    const kmbNumber = toKMBFormat(abs, { usd });
    if (kmbNumber) return kmbNumber;
  }

  const formatted = removeTrailingZeros(abs.toFormat(decimals, BigNumber.ROUND_DOWN));
  const sign = resolveSign(bigNum, formatted);

  return sign + prefix + formatted;
};
