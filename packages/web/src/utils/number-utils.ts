import { MathSymbolType } from "@common/values/data-constant";
import { unitsUpperCase } from "@common/values/global-initial-value";
import BigNumber from "bignumber.js";

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
): string => {
  if (!isNumber(value)) {
    // TODO : Error Check
    return usd ? "$0.00" : "0";
  }

  const bigNumber = BigNumber(value);
  const wholeNumberLength = bigNumber.decimalPlaces(0).toString().length;

  if (wholeNumberLength >= 13)
    return (
      (usd ? "$" : "") +
      bigNumber.dividedBy(Math.pow(10, 12)).decimalPlaces(2) +
      unitsUpperCase.trillion
    );
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
  if (wholeNumberLength >= 4)
    return (
      (usd ? "$" : "") +
      bigNumber.dividedBy(Math.pow(10, 3)).decimalPlaces(2) +
      unitsUpperCase.thousand
    );

  // TODO : Else Return Type
  return (usd ? "$" : "") + bigNumber.decimalPlaces(2).toString();
};
