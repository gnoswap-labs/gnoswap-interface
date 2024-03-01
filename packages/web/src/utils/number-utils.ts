import { MathSymbolType } from "@common/values/data-constant";
import {
  unitsLowerCase,
  unitsUpperCase,
} from "@common/values/global-initial-value";
import BigNumber from "bignumber.js";
import { convertToKMB, convertToMB } from "./stake-position-utils";

export const isNumber = (value: BigNumber | string | number): boolean => {
  const reg = /^-?\d+\.?\d*$/;
  const target = value.toString();
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

export function toNumberString(value: string) {
  return BigNumber(value).toString();
}

export const toGnot = (value: number, denom: string) => {
  return {
    value: valueConvert(value, denom),
    denom: denomConvert(denom),
  };
};

export const denomConvert = (denom: string) => {
  return isUgnot(denom) ? "GNOT" : `${denom}`.toUpperCase().trim();
};

export const valueConvert = (value: number, denom: string) => {
  return isUgnot(denom) ? value / 1000000 : value;
};

const isUgnot = (denom: string) => {
  return ["ugnot", "UGNOT"].includes(denom);
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
): string => {
  if (!isNumber(value)) {
    // TODO : Error Check
    return usd ? "$0" : "0";
  }

  const bigNumber = BigNumber(value);
  const wholeNumberLength = bigNumber.decimalPlaces(0).toString().length;

  // if (wholeNumberLength >= 13)
  //   return (
  //     (usd ? "$" : "") +
  //     bigNumber.dividedBy(Math.pow(10, 12)).decimalPlaces(2) +
  //     unitsUpperCase.trillion
  //   );
  if (wholeNumberLength >= 10)
    return (
      (usd ? "$" : "") +
      bigNumber.dividedBy(Math.pow(10, 9)).decimalPlaces(2) +
      unitsUpperCase.billion
    );
  if (wholeNumberLength >= 7)
    return (
      (usd ? "$" : "") +
      bigNumber.dividedBy(Math.pow(10, 6)).decimalPlaces(2) +
      unitsUpperCase.million
    );
  if (isKMB) {
    if (wholeNumberLength >= 4)
    return (
      (usd ? "$" : "") +
      bigNumber.dividedBy(Math.pow(10, 3)).decimalPlaces(2) +
      unitsUpperCase.thousand
    );
  }

  // TODO : Else Return Type
  if (bigNumber.isLessThan(0.01) && bigNumber.isGreaterThan(0)) {
    return (usd ? "<$" : "") +"0.01";
  }
  if (bigNumber.isInteger()) {
    return (usd ? "$" : "") + bigNumber.decimalPlaces(0).toString();
  }
  return (usd ? "$" : "") + bigNumber.decimalPlaces(2).toString();
};

/**
 *
 * @param value
 * @param usd
 * @returns
 */
export const toLowerUnitFormat = (
  value: BigNumber | string | number,
  usd = false,
): string => {
  if (!isNumber(value)) {
    // TODO : Error Check
    return usd ? "$0.00" : "0";
  }

  const bigNumber = BigNumber(value);
  const wholeNumberLength = bigNumber.decimalPlaces(0).toString().length;

  const prefixe = usd ? "$" : "";
  if (wholeNumberLength >= 13)
    return (
      prefixe +
      bigNumber.dividedBy(Math.pow(10, 12)).decimalPlaces(2) +
      unitsLowerCase.trillion
    );
  if (wholeNumberLength >= 10)
    return (
      prefixe +
      bigNumber.dividedBy(Math.pow(10, 9)).decimalPlaces(2) +
      unitsLowerCase.billion
    );
  if (wholeNumberLength >= 7)
    return (
      prefixe +
      bigNumber.dividedBy(Math.pow(10, 6)).decimalPlaces(2) +
      unitsLowerCase.million
    );
  if (wholeNumberLength >= 4)
    return (
      prefixe +
      bigNumber.dividedBy(Math.pow(10, 3)).decimalPlaces(2) +
      unitsLowerCase.thousand
    );

  // TODO : Else Return Type
  return prefixe + bigNumber.decimalPlaces(2).toString();
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

export function toDecimalNumber(
  value: BigNumber | string | number,
  decimals?: number,
) {
  const powers = 10 ** (decimals || 0);
  const num = BigNumber(value).toNumber();
  return Math.round(num * powers) / powers;
}

export function numberToUSD(value: number) {
  return Number.isNaN(value) ? "-" : `$${BigNumber(value).toFormat(2)}`;
}

export function numberToUSDV2(value: number) {
  return Number.isNaN(value) ? "-" : `$${value}`;
}

export function matchInputNumber(value: string) {
  const regexpOfNum = /^(\d*)[\.]?(\d*)?$/g;
  const regexpOfStartWithZeroes = /^(?!00)/;
  return regexpOfNum.test(value) && regexpOfStartWithZeroes.test(value);
}

export function prettyNumber(val: string | number) {
  return BigNumber(val).decimalPlaces(2).toFormat(Number(val) === 0 ? 0 : 2);
}

export function prettyNumberFloatInteger(val: string | number, isKMB?: boolean) {
  const func = isKMB ? convertToKMB : convertToMB;
  if (Number.isInteger(Number(val))) {
    return func(val.toString());
  } else {
    return func(val.toString(), 6);
  }
}

export function formatUsdNumber3Digits(val: string | number) {
  if (Number.isNaN(Number(val))) {
    return String(val);
  }
  if (Number(val) >= 1) {
    return (Math.floor(Number(val) * 100) / 100).toString();
  }
  const stringVal = val.toString();
  for (let index = 0; index < stringVal.length; index++) {
    if ((stringVal[index] !== "0" && stringVal[index] !== ".")) {
      return stringVal.slice(0, index + 3);
    }
  }
  return stringVal;
}

export function formatNumberToLocaleString(inputNumber: Number | string) {
  if (Number.isInteger(Number(inputNumber))) {
      // If the number is an integer, return it as is
      return inputNumber.toLocaleString(undefined, { maximumFractionDigits: 0 });
  } else {
      // If the number is not an integer, format it with toLocaleString
      // and set minimumFractionDigits to 6
      return inputNumber.toLocaleString(undefined, { maximumFractionDigits: 6 });
  }
}

export function convertLargePrice(val: string) {
  if (Number(val) >= 1000000000) {
    return ">$999,999,999.99";
  }
  return `${toUnitFormat(val || "0.00", true, false)}`;
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
    return (usd ? "<$" : "") +"0.01";
  }
  if (bigNumber.isInteger()) {
    return (usd ? "$" : "") + bigNumber.decimalPlaces(0).toString();
  }
  return (usd ? "$" : "") + bigNumber.decimalPlaces(2).toFormat(2);
};

export function removeTrailingZeros(value: string) {
  return value.replace(/\.?0+$/, "");
}