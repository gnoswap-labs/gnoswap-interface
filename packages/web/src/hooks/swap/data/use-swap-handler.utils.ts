import BigNumber from "bignumber.js";

import { TokenModel } from "@models/token/token-model";

function getDecimalLength(value: string) {
  return value.includes(".") ? value.split(".")[1].length : 0;
}

function isReducingOverPrecision(changed: string, previous: string | undefined, decimals: number) {
  if (!previous) {
    return false;
  }

  const previousDecimalLength = getDecimalLength(previous);
  const changedDecimalLength = getDecimalLength(changed);

  return previousDecimalLength > decimals && changedDecimalLength < previousDecimalLength;
}

export function handleAmount(changed: string, token: TokenModel | null, previous?: string) {
  let value = changed;
  const decimals = token?.decimals;

  if (decimals === undefined) {
    return { isValid: false, value: changed };
  }

  if (changed.includes(".") && changed.split(".")[1].length > decimals) {
    if (isReducingOverPrecision(changed, previous, decimals)) {
      return { isValid: true, value: changed };
    }

    return { isValid: false, value: changed };
  }

  if (!value || BigNumber(value).isZero()) {
    value = changed;
  } else {
    value = BigNumber(value).toFixed(decimals, 1);
  }

  if (BigNumber(changed).isEqualTo(value)) {
    const dotIndex = changed.indexOf(".");
    if (dotIndex === -1 || changed.length - dotIndex - 1 < decimals) {
      value = changed;
    }
  }

  return { isValid: true, value };
}
