import BigNumber from "bignumber.js";
import { buildPricePrefix } from "./common";
import { toKMBFormat } from "./number-utils";

// Values at or below 1e-6 are treated as zero to prevent floating-point
// dust from displaying as "<$0.01" when the actual amount is effectively 0.
const DUST_THRESHOLD = BigNumber("1e-6");

export const removeTrailingZeros = (value: string) => value.replace(/\.?0+$/, "");

const normalizeValue = (value: string | number | BigNumber) => value.toString().replace(/,/g, "");

const toBigNumber = (value: string | number | BigNumber) => BigNumber(normalizeValue(value));

const getInternalMinLimit = (minLimit?: number | null, decimals?: number) =>
  minLimit || (decimals ? 1 / Math.pow(10, decimals) : null);

const isDustOrZero = (value: BigNumber) => value.isEqualTo(0) || value.abs().isLessThanOrEqualTo(DUST_THRESHOLD);

export const formatPoolPairAmount = (
  amount?: number | BigNumber | string | null,
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
  if (amount === null || amount === undefined) {
    return "-";
  }

  const valueWithoutComma = normalizeValue(amount);
  const bigNumberValue = BigNumber(valueWithoutComma);

  if (bigNumberValue.isNaN()) {
    return "-";
  }

  if (isDustOrZero(bigNumberValue)) return "0";

  const internalMinLimit = getInternalMinLimit(minLimit, decimals);

  if (hasMinLimit && internalMinLimit && bigNumberValue.isLessThan(internalMinLimit)) {
    return `<${internalMinLimit}`;
  }

  if (minLimit && bigNumberValue.isLessThan(minLimit) && bigNumberValue.isGreaterThan(0)) {
    return `<${minLimit}`;
  }

  if (isKMB) {
    const kmbNumber = toKMBFormat(valueWithoutComma);
    if (kmbNumber) return kmbNumber;
  }

  if (decimals) {
    const formattedNumber = bigNumberValue.toFormat(decimals, BigNumber.ROUND_DOWN);
    return removeTrailingZeros(formattedNumber);
  }

  return bigNumberValue.toFormat();
};

export const formatRate = (
  amount?: number | BigNumber | string | null,
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
  if (amount === null || amount === undefined || BigNumber(amount).isNaN()) {
    return "-";
  }

  const valueWithoutComma = normalizeValue(amount);
  const bigNumberValue = BigNumber(valueWithoutComma);
  const sign = showSign ? (bigNumberValue.isLessThan(0) ? "-" : "+") : "";

  const internalMinLimit = getInternalMinLimit(minLimit, decimals);

  if (!allowZeroDecimals && isDustOrZero(bigNumberValue)) {
    return sign + "0%";
  }

  if (internalMinLimit && bigNumberValue.isLessThan(internalMinLimit) && bigNumberValue.isGreaterThan(0)) {
    return `<${internalMinLimit}%`;
  }

  return sign + bigNumberValue.abs().toFormat(decimals, BigNumber.ROUND_DOWN) + "%";
};

export const formatTokenAmount = (
  amount: string | number | BigNumber | null,
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

  const inputAsNumber = toBigNumber(amount);
  const internalSuffix = suffix ? " " + suffix : "";

  if (inputAsNumber.isNaN()) return amount.toString();

  if (isDustOrZero(inputAsNumber)) return "0" + internalSuffix;

  const internalMinLimit = getInternalMinLimit(minLimit, decimals);

  if (internalMinLimit && inputAsNumber.isLessThan(internalMinLimit)) {
    return `<${internalMinLimit}${internalSuffix}`;
  }

  if (isKMB) {
    const kmbNumber = toKMBFormat(inputAsNumber);
    if (kmbNumber) return kmbNumber;
  }
  if (decimals) {
    return `${inputAsNumber.toFormat(decimals, BigNumber.ROUND_DOWN)}${internalSuffix}`;
  }

  return `${BigNumber(inputAsNumber).toFormat()}${internalSuffix}`;
};

interface FormatPriceOptions {
  usd?: boolean;
  isKMB?: boolean;
  lessThan1Significant?: number;
  greaterThan1Decimals?: number;
  forcedDecimals?: boolean;
  approx?: boolean;
}

export const formatPrice = (value?: BigNumber | string | number | null, options: FormatPriceOptions = {}): string => {
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

  const valueWithoutComma = normalizeValue(value);
  const valueAsBigNum = BigNumber(valueWithoutComma);
  const absValue = valueAsBigNum.abs();

  const prefix = buildPricePrefix({ usd, approx });
  const negativeSign = valueAsBigNum.isLessThan(0) ? "-" : "";

  if (absValue.isNaN()) return value.toString();

  if (absValue.isEqualTo(0)) return prefix + "0";

  if (isKMB) {
    const kmbNumber = toKMBFormat(valueWithoutComma, { usd });
    if (kmbNumber) return kmbNumber;
  }

  if (absValue.isLessThan(1)) {
    const tempNum = valueAsBigNum.toPrecision(lessThan1Significant, BigNumber.ROUND_DOWN);
    const formattedValue = `${negativeSign}${prefix}${tempNum}`;
    return formattedValue;
  }

  const formattedNumber = valueAsBigNum.toFormat(greaterThan1Decimals, BigNumber.ROUND_DOWN);
  const finalNumber = `${negativeSign}${prefix}${
    forcedDecimals ? formattedNumber : removeTrailingZeros(formattedNumber)
  }`;

  return finalNumber;
};

export const formatOtherPrice = (
  value?: BigNumber | string | number | null,
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
  if (value === "" || value === null || value === undefined) {
    return "-";
  }

  const valueWithoutComma = normalizeValue(value);

  const valueAsBigNum = BigNumber(valueWithoutComma);
  const absValue = valueAsBigNum.abs();

  const prefix = usd ? "$" : "";
  const negativeSign = valueAsBigNum.isLessThan(0) ? "-" : "";

  if (absValue.isNaN()) return "-";

  if (isDustOrZero(absValue)) {
    if (zeroAsEmpty) return "-";

    return prefix + "0";
  }

  const internalMinLimit = getInternalMinLimit(undefined, decimals);

  if (hasMinLimit && internalMinLimit && valueAsBigNum.isLessThan(internalMinLimit) && valueAsBigNum.isGreaterThan(0)) {
    return `<${prefix}${minLimit || internalMinLimit}`;
  }

  if (isKMB) {
    const kmbNumber = toKMBFormat(valueWithoutComma, { usd });
    if (kmbNumber) return kmbNumber;
  }

  const formattedNumber = absValue.toFormat(decimals, BigNumber.ROUND_DOWN);
  const trimmedNumber = decimals > 0 ? removeTrailingZeros(formattedNumber) : formattedNumber;

  return negativeSign + prefix + trimmedNumber;
};
