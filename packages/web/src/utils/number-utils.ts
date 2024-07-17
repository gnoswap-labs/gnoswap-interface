import BigNumber from "bignumber.js";

import { MathSymbolType } from "@common/values/data-constant";
import { unitsUpperCase } from "@common/values/global-initial-value";

import { formatPoolPairAmount } from "./new-number-utils";
import { convertToKMB } from "./stake-position-utils";

export const isNumber = (value: BigNumber | string | number): boolean => {
  const reg = /^-?\d+\.?\d*$/;
  const target = value?.toString();
  return (
    reg.test(target) &&
    !isNaN(parseFloat(target)) &&
    isFinite(parseFloat(target))
  );
};

export const toNumberFormat = (
  value: BigNumber | string | number,
  decimalPlaces?: number,
) => {
  const bigNumber = BigNumber(value);
  if (decimalPlaces) {
    return bigNumber.decimalPlaces(decimalPlaces).toFormat();
  }
  return bigNumber.toFormat();
};

export const mathSybmolAbsFormat = (
  value: BigNumber | string | number,
  decimal?: number,
  usd = false,
  percent = false,
): { status: MathSymbolType; value: string } => {
  if (!isNumber(value)) {
    // TODO : Error Check
    return {
      status: "NAN",
      value: "",
    };
  }

  const bigNumber = BigNumber(value);
  const isNegative = bigNumber.isNegative();
  return {
    status: isNegative ? "NEGATIVE" : "POSITIVE",
    value:
      (isNegative ? "-" : "+") +
      (usd ? "$" : "") +
      toNumberFormat(bigNumber.abs(), decimal) +
      (percent ? "%" : ""),
  };
};

/**
 *
 * @param value
 * @param usd
 * @returns
 */
export const toUnitFormat = (
  value: BigNumber | string | number,
  usd = false,
  isKMB = false,
  isFormat = true,
): string => {
  if (!isNumber(value)) {
    // TODO : Error Check
    return usd ? "$0" : "0";
  }

  const bigNumber = BigNumber(value);
  const wholeNumberLength = bigNumber.decimalPlaces(0).toString().length;

  if (wholeNumberLength >= 10 && isFormat)
    return (
      (usd ? "$" : "") +
      bigNumber.dividedBy(Math.pow(10, 9)).decimalPlaces(2) +
      unitsUpperCase.billion
    );
  if (wholeNumberLength >= 7 && isFormat)
    return (
      (usd ? "$" : "") +
      bigNumber.dividedBy(Math.pow(10, 6)).decimalPlaces(2) +
      unitsUpperCase.million
    );
  if (isKMB) {
    if (wholeNumberLength >= 4 && isFormat) {
      return (
        (usd ? "$" : "") +
        convertToKMB(bigNumber.toNumber().toString(), {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        })
      );
    }
  }

  // TODO : Else Return Type
  if (bigNumber.isLessThan(0.01) && bigNumber.isGreaterThan(0)) {
    return (usd ? "<$" : "<$") + "0.01";
  }
  if (Number(bigNumber) === 0) {
    return (usd ? "$" : "") + bigNumber.decimalPlaces(2).toFixed();
  }
  return (
    (usd ? "$" : "") +
    bigNumber
      .decimalPlaces(2)
      .toNumber()
      .toLocaleString("en", { minimumFractionDigits: 2 })
  );
};

export const toKMBFormat = (
  value: BigNumber | string | number,
  {
    usd = false,
  }: {
    usd?: boolean;
  } = {},
) => {
  const valueWithoutComma = value.toString().replace(/,/g, "");

  if (!isNumber(valueWithoutComma)) {
    return usd ? "$0" : "0";
  }

  const bigNumber = BigNumber(valueWithoutComma).abs();
  const prefix = usd ? "$" : "";
  const negativeSign = BigNumber(value).isLessThan(0) ? "-" : "";

  if (bigNumber.isGreaterThanOrEqualTo(1e9)) {
    return (
      negativeSign +
      prefix +
      bigNumber.dividedBy(Math.pow(10, 9)).toFixed(2, BigNumber.ROUND_DOWN) +
      unitsUpperCase.billion
    );
  }

  if (bigNumber.isGreaterThanOrEqualTo(1e6)) {
    return (
      negativeSign +
      prefix +
      bigNumber.dividedBy(Math.pow(10, 6)).toFixed(2, BigNumber.ROUND_DOWN) +
      unitsUpperCase.million
    );
  }

  if (bigNumber.isGreaterThanOrEqualTo(1e3)) {
    return (
      negativeSign +
      prefix +
      bigNumber.dividedBy(Math.pow(10, 3)).toFixed(2, BigNumber.ROUND_DOWN) +
      unitsUpperCase.thousand
    );
  }
};

export const toPriceFormatNotRounding = (
  value: BigNumber | string | number,
  {
    usd = false,
    isKMBFormat = true,
    lestThan1Decimals = 3,
    lessThan1Significant,
    fixedLessThan1 = false,
    greaterThan1Decimals = 2,
    fixedGreaterThan1 = false,
    minLimit,
  }: {
    usd?: boolean;
    isKMBFormat?: boolean;
    lestThan1Decimals?: number;
    lessThan1Significant?: number;
    fixedLessThan1?: boolean;
    greaterThan1Decimals?: number;
    fixedGreaterThan1?: boolean;
    minLimit?: number;
  } = {},
): string => {
  const valueWithoutComma = value.toString().replace(/,/g, "");

  if (!isNumber(valueWithoutComma)) {
    return usd ? "$0" : "0";
  }
  const bigNumber = BigNumber(valueWithoutComma).abs();
  const prefix = usd ? "$" : "";
  const negativeSign = BigNumber(valueWithoutComma).isLessThan(0) ? "-" : "";

  if (minLimit && bigNumber.isLessThan(minLimit) && !bigNumber.isEqualTo(0)) {
    return (usd ? "<$" : "<") + minLimit.toString();
  }

  if (bigNumber.isEqualTo(0)) {
    return prefix + "0";
  }

  if (isKMBFormat) {
    const kmbNumber = toKMBFormat(valueWithoutComma, { usd });
    if (kmbNumber) return kmbNumber;
  }

  const negativeSignLength = bigNumber.isLessThan(0) ? 1 : 0;

  if (Number(bigNumber) < 1) {
    const tempNum = bigNumber
      .toNumber()
      .toLocaleString("en-US", {
        maximumFractionDigits: lestThan1Decimals + 1,
        minimumFractionDigits: lestThan1Decimals + 1,
        minimumSignificantDigits: lessThan1Significant
          ? lessThan1Significant + 1
          : undefined,
        maximumSignificantDigits: lessThan1Significant
          ? lessThan1Significant + 1
          : undefined,
      })
      .replace(/,/g, "");

    const cutNumber = tempNum.substring(0, tempNum.length - 1);

    if (fixedLessThan1) {
      return negativeSign + prefix + cutNumber;
    }

    // Wrapped in BigNumber(cutNumber).toFormat() to remove trailingZeros
    return negativeSign + prefix + BigNumber(cutNumber).toFormat();
  }

  const finalGreaterThan1Decimals = greaterThan1Decimals + negativeSignLength;

  const tempNum = bigNumber
    .toNumber()
    .toLocaleString("en-US", {
      minimumFractionDigits: finalGreaterThan1Decimals + 1,
      maximumFractionDigits: finalGreaterThan1Decimals + 1,
    })
    .replace(/,/g, "");

  const cutNumber = tempNum.substring(0, tempNum.length - 1);

  if (fixedGreaterThan1) {
    return (
      negativeSign +
      prefix +
      BigNumber(cutNumber).toFormat(greaterThan1Decimals)
    );
  }

  return negativeSign + prefix + BigNumber(cutNumber).toFormat();
};

/**
 * version 2 of @toUnitFormat
 */
export const toPriceFormat = (
  value: BigNumber | string | number,
  {
    usd = false,
    isKMBFormat = true,
    isRounding = true,
    lestThan1Decimals = 3,
    greaterThan1Decimals = 2,
    forcedGreaterThan1Decimals = true,
    minLimit,
    fixedLessThan1Decimal,
    fixedLessThan1Significant,
  }: {
    usd?: boolean;
    isKMBFormat?: boolean;
    isRounding?: boolean;
    lestThan1Decimals?: number;
    greaterThan1Decimals?: number;
    forcedDecimals?: boolean;
    minLimit?: number;
    forcedGreaterThan1Decimals?: boolean;
    fixedLessThan1Decimal?: number;
    fixedLessThan1Significant?: number;
  } = {},
): string => {
  const valueWithoutComma = value.toString().replace(/,/g, "");

  if (!isNumber(valueWithoutComma)) {
    return usd ? "$0" : "0";
  }
  const bigNumber = BigNumber(valueWithoutComma).abs();
  const prefix = usd ? "$" : "";
  const negativeSign = BigNumber(valueWithoutComma).isLessThan(0) ? "-" : "";

  if (isKMBFormat) {
    const kmbNumber = toKMBFormat(value, { usd });
    if (kmbNumber) {
      return kmbNumber;
    }
  }

  if (
    minLimit &&
    bigNumber.isLessThan(minLimit) &&
    bigNumber.isGreaterThan(0)
  ) {
    return (usd ? "<$" : "<") + minLimit.toString();
  }

  if (bigNumber.isEqualTo(0)) {
    return prefix + bigNumber.decimalPlaces(2).toFixed();
  }

  const negativeSignLength = bigNumber.isLessThan(0) ? 1 : 0;
  if (Number(bigNumber) < 1) {
    const finalLestThan1Decimals = lestThan1Decimals;

    if (!isRounding) {
      const tempNum = bigNumber.toNumber().toLocaleString("en-US", {
        maximumFractionDigits: fixedLessThan1Decimal
          ? fixedLessThan1Decimal + 1
          : undefined,
        minimumFractionDigits: fixedLessThan1Decimal
          ? fixedLessThan1Decimal + 1
          : undefined,
        minimumSignificantDigits:
          !fixedLessThan1Decimal && fixedLessThan1Significant
            ? finalLestThan1Decimals + 1
            : undefined,
        maximumSignificantDigits: !fixedLessThan1Decimal
          ? finalLestThan1Decimals + 1
          : undefined,
      });
      const [, decimalPart] = tempNum.split(".");
      const significantNumberLength = Number(decimalPart).toString().length;

      if (
        decimalPart?.length > finalLestThan1Decimals &&
        significantNumberLength > finalLestThan1Decimals
      ) {
        return negativeSign + prefix + tempNum.substring(0, tempNum.length - 1);
      }
    }

    return (
      negativeSign +
      prefix +
      bigNumber.toNumber().toLocaleString("en-US", {
        maximumFractionDigits: fixedLessThan1Decimal
          ? fixedLessThan1Decimal
          : undefined,
        minimumFractionDigits: fixedLessThan1Decimal
          ? fixedLessThan1Decimal
          : undefined,
        minimumSignificantDigits:
          !fixedLessThan1Decimal && fixedLessThan1Significant
            ? finalLestThan1Decimals
            : undefined,
        maximumSignificantDigits: !fixedLessThan1Decimal
          ? finalLestThan1Decimals
          : undefined,
      })
    );
  }

  const finalGreaterThan1Decimals =
    (greaterThan1Decimals ?? 2) + negativeSignLength;

  const tempNum = bigNumber.toNumber().toLocaleString("en-US", {
    minimumFractionDigits: forcedGreaterThan1Decimals
      ? finalGreaterThan1Decimals + 1
      : 0,
    maximumFractionDigits: finalGreaterThan1Decimals + 1,
  });
  const [, decimalPart] = tempNum.split(".");

  if (
    !isRounding &&
    !bigNumber.isInteger() &&
    decimalPart?.length > finalGreaterThan1Decimals
  ) {
    const result =
      negativeSign + prefix + tempNum.substring(0, tempNum.length - 1);

    const [notRoundingIntPart, notRoundingDecimalPart] = result.split(".");

    if (notRoundingDecimalPart === "0") return notRoundingIntPart;

    return result;
  }

  return (
    negativeSign +
    prefix +
    bigNumber
      .decimalPlaces(finalGreaterThan1Decimals)
      .toNumber()
      .toLocaleString("en", {
        maximumFractionDigits: finalGreaterThan1Decimals,
        minimumFractionDigits: forcedGreaterThan1Decimals
          ? finalGreaterThan1Decimals
          : undefined,
      })
  );
};

export function toMillionFormat(value: number | string) {
  const num = BigNumber(value);
  if (num.isNaN()) {
    return null;
  }
  const MILLION = 1000000;
  if (num.isLessThan(MILLION)) {
    return BigNumber(num).toFormat(2);
  }
  return `${BigNumber(num).dividedBy(MILLION).toFormat(2)}m`;
}

export function matchInputNumber(value: string) {
  const regexpOfNum = /^(\d*)[\.]?(\d*)?$/g;
  const regexpOfStartWithZeroes = /^(?!00)/;
  return regexpOfNum.test(value) && regexpOfStartWithZeroes.test(value);
}

export function prettyNumberFloatInteger(
  val: string | number,
  isKMB?: boolean,
) {
  if (Number.isInteger(Number(val))) {
    return convertToKMB(val.toString(), { isIgnoreKFormat: !isKMB });
  } else {
    return convertToKMB(val.toString(), {
      isIgnoreKFormat: !isKMB,
      maximumFractionDigits: 6,
    });
  }
}

export function formatUsdNumber3Digits(val: string | number) {
  if (Number.isNaN(Number(val))) {
    return String(val);
  }
  if (Number(val) === 0) {
    return "0";
  }
  if (Number(val) >= 1) {
    return (Math.floor((Number(val) + 0.005) * 100) / 100).toFixed(2);
  }
  const stringVal = val.toString();
  for (let index = 0; index < stringVal.length; index++) {
    if (stringVal[index] !== "0" && stringVal[index] !== ".") {
      return stringVal.slice(0, index + 3);
    }
  }
  return stringVal;
}

export const formatUSDWallet = (
  value: BigNumber | string | number,
  usd = false,
): string => {
  if (!isNumber(value)) {
    // TODO : Error Check
    return usd ? "$0" : "0";
  }

  const bigNumber = BigNumber(value);
  if (bigNumber.isLessThan(0.01) && bigNumber.isGreaterThan(0)) {
    return (usd ? "<$" : "") + "0.01";
  }
  if (bigNumber.isInteger()) {
    return (usd ? "$" : "") + bigNumber.decimalPlaces(0).toString();
  }
  return (usd ? "$" : "") + bigNumber.decimalPlaces(2).toFormat(2);
};

export function removeTrailingZeros(value: string) {
  if (BigNumber(value).isZero()) {
    return "0";
  }
  return value.replace(/\.?0+$/, "");
}

export function countZeros(decimalFraction: string) {
  const scientificNotation = parseFloat(decimalFraction).toExponential();
  const exponent = parseFloat(scientificNotation.split("e")[1]);
  return Math.abs(exponent);
}

const getSubcriptChars = (number: string) => {
  let temp = "";
  const subscriptZeroCharCode = 8320;
  const numberOfZeroString = (countZeros(number) - 1).toString();

  for (let index = 0; index < numberOfZeroString.length; index++) {
    const currentChar = Number(numberOfZeroString[index]);
    const singleSubscriptNumber = String.fromCharCode(
      subscriptZeroCharCode + Number(currentChar),
    );
    temp += singleSubscriptNumber;
  }

  return temp;
};

export function subscriptFormat(
  number: string | number,
  options?: {
    significantDigits?: number;
    subscriptOffset?: number;
  },
) {
  const numberStr = BigNumber(number).toFixed();
  const numberOfZero = countZeros(numberStr);
  // const significantDigits = options?.significantDigits || 5;
  const zeroCountOffset = options?.subscriptOffset
    ? options?.subscriptOffset + 1
    : 5;

  if (numberOfZero <= zeroCountOffset) {
    return formatPoolPairAmount(number, { decimals: 6 });
  }

  const subscriptChars = getSubcriptChars(numberStr);

  const result = `0.0${subscriptChars}${removeTrailingZeros(
    numberStr.slice(numberOfZero + 1, numberOfZero + 6),
  )}`;
  return result;
}

export function toShiftBitInt(value: string | number, shifted: number): bigint {
  const shiftedValue = BigNumber(value).shiftedBy(shifted).toNumber();
  return BigInt(Math.round(shiftedValue));
}
