import BigNumber from "bignumber.js";
import { toKMBFormat } from "./number-utils";

export const formatPoolPairAmount = (
  amount?: number | BigNumber | string | null,
  {
    decimals,
    minLimit,
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

  const valueWithoutComma = amount?.toString().replace(/,/g, "");
  const bigNumberValue = BigNumber(valueWithoutComma);

  if (bigNumberValue.isNaN()) {
    return "-";
  }

  if (bigNumberValue.isEqualTo(0)) return "0";

  const internalMinLimit =
    minLimit || (decimals ? 1 / Math.pow(10, decimals) : null);

  if (
    hasMinLimit &&
    internalMinLimit &&
    bigNumberValue.isLessThan(internalMinLimit)
  ) {
    return `<${internalMinLimit}`;
  }

  if (
    minLimit &&
    bigNumberValue.isLessThan(minLimit) &&
    bigNumberValue.isGreaterThan(0)
  ) {
    return `<${minLimit}`;
  }

  if (isKMB) {
    const kmbNumber = toKMBFormat(valueWithoutComma);
    if (kmbNumber) return kmbNumber;
  }

  let stringValue = "";

  if (decimals) {
    stringValue = bigNumberValue.toFormat(
      decimals,
      decimals ? BigNumber.ROUND_DOWN : undefined,
    );
  } else {
    stringValue = bigNumberValue.toFormat();
  }

  const [integerValue,fractionValue] = stringValue.split(".");
  if (fractionValue) {
    const fractionString = Number(`0.${fractionValue}`).toString().split(".")[1];
    return `${integerValue}.${fractionString}`;
  } else return stringValue;
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

  const valueWithoutComma = amount?.toString().replace(/,/g, "");
  const bigNumberValue = BigNumber(valueWithoutComma);
  const sign = showSign ? (bigNumberValue.isLessThan(0) ? "-" : "+") : "";

  const internalMinLimit =
    minLimit || (decimals ? 1 / Math.pow(10, decimals) : null);

  if (!allowZeroDecimals && bigNumberValue.isEqualTo(0)) {
    return sign + "0%";
  }

  if (
    internalMinLimit &&
    bigNumberValue.isLessThan(internalMinLimit) &&
    bigNumberValue.isGreaterThan(0)
  ) {
    return `<${internalMinLimit}%`;
  }

  return (
    sign +
    BigNumber(amount).abs().toFormat(decimals, BigNumber.ROUND_DOWN) +
    "%"
  );
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

  const inputAsNumber = BigNumber(amount?.toString().replace(/,/g, ""));
  const internalSuffix = suffix ? " " + suffix : "";

  if (inputAsNumber.isNaN()) return amount.toString();

  if (amount === 0) return "0" + internalSuffix;

  const internalMinLimit =
    minLimit || (decimals ? 1 / Math.pow(10, decimals) : null);

  if (internalMinLimit && inputAsNumber.isLessThan(internalMinLimit)) {
    return `<${internalMinLimit}${internalSuffix}`;
  }

  if (isKMB) {
    const kmbNumber = toKMBFormat(inputAsNumber);
    if (kmbNumber) return kmbNumber;
  }
  if (decimals) {
    return `${inputAsNumber.toFormat(
      decimals,
      BigNumber.ROUND_DOWN,
    )}${internalSuffix}`;
  }

  return `${BigNumber(inputAsNumber).toFormat()}${internalSuffix}`;
};

export const formatPrice = (
  value?: BigNumber | string | number | null,
  {
    usd = true,
    isKMB = true,
    lessThan1Significant = 3,
    greaterThan1Decimals = 2,
  }: {
    usd?: boolean;
    isKMB?: boolean;
    lessThan1Significant?: number;
    greaterThan1Decimals?: number;
  } = {},
): string => {
  if (value === "" || value === null || value === undefined) {
    return "-";
  }

  const valueWithoutComma = value.toString().replace(/,/g, "");

  const valueAsBigNum = BigNumber(valueWithoutComma);
  const absValue = valueAsBigNum.abs();

  const prefix = usd ? "$" : "";
  const negativeSign = valueAsBigNum.isLessThan(0) ? "-" : "";

  if (absValue.isNaN()) return value.toString();

  if (absValue.isEqualTo(0)) return prefix + "0";

  if (isKMB) {
    const kmbNumber = toKMBFormat(valueWithoutComma, { usd });
    if (kmbNumber) return kmbNumber;
  }

  if (absValue.isLessThan(1)) {
    const tempNum = valueAsBigNum.toPrecision(
      lessThan1Significant,
      BigNumber.ROUND_DOWN,
    );

    return negativeSign + prefix + tempNum;
  }

  return (
    negativeSign +
    prefix +
    valueAsBigNum.toFormat(greaterThan1Decimals, BigNumber.ROUND_DOWN)
  );
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

  const valueWithoutComma = value.toString().replace(/,/g, "");

  const valueAsBigNum = BigNumber(valueWithoutComma);
  const absValue = valueAsBigNum.abs();

  const prefix = usd ? "$" : "";
  const negativeSign = valueAsBigNum.isLessThan(0) ? "-" : "";

  if (absValue.isNaN()) return value.toString();

  if (absValue.isEqualTo(0)) {
    if (zeroAsEmpty) return "-";

    return prefix + "0";
  }

  const internalMinLimit = decimals ? 1 / Math.pow(10, decimals) : null;

  if (
    hasMinLimit &&
    internalMinLimit &&
    valueAsBigNum.isLessThan(internalMinLimit) &&
    valueAsBigNum.isGreaterThan(0)
  ) {
    return `<${prefix}${minLimit || internalMinLimit}`;
  }

  if (isKMB) {
    const kmbNumber = toKMBFormat(valueWithoutComma, { usd });
    if (kmbNumber) return kmbNumber;
  }

  return (
    negativeSign +
    prefix +
    valueAsBigNum.toFormat(decimals, BigNumber.ROUND_DOWN)
  );
};
