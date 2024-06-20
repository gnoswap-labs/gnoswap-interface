import BigNumber from "bignumber.js";
import { removeTrailingZeros } from "./number-utils";

export const convertToMB = (price: string, maximumFractionDigits?: number) => {
  if (Number.isNaN(Number(price))) return "-";
  if (Math.floor(Number(price)).toString().length < 7) {
    if (Number(price) < 1) return Number(price).toString();
    if (Number.isInteger(Number(price))) return Number(price).toLocaleString("en-US", {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    });
    return Number(price).toLocaleString("en-US", {
      maximumFractionDigits: maximumFractionDigits || 2,
      minimumFractionDigits: 2,
    });
  } else {
    const temp = Math.floor(Number(price));
    if (temp >= 1e9) {
      return (
        (temp / 1e9).toLocaleString("en-US", {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        }) + "B"
      );
    }
    if (temp >= 1e6) {
      return (
        (temp / 1e6).toLocaleString("en-US", {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        }) + "M"
      );
    }
    return Number(price).toLocaleString("en-US", {
      maximumFractionDigits: maximumFractionDigits || 2,
      minimumFractionDigits: 2,
    });
  }
};

export const formatTokenExchangeRate = (
  inputNumber: string | number | BigNumber, {
    isIgnoreKFormat = false,
    forcedIntegerDecimals = 0,
    maxSignificantDigits = 5,
    isInfinite = false,
    minLimit,
    fixedDecimalDigits,
  }: {
    isIgnoreKFormat?: boolean;
    forcedIntegerDecimals?: number;
    maxSignificantDigits?: number;
    minLimit?: number;
    isInfinite?: boolean;
    fixedDecimalDigits?: number;
  } = {}
) => {
  const inputAsNumber = Number(inputNumber.toString().replace(/,/g, ""));

  if (isInfinite) return "∞";

  if (Number.isNaN(inputAsNumber)) return "-";

  if (inputAsNumber < 1e3) {
    if (minLimit && inputAsNumber < minLimit && inputAsNumber > 0) return `<${minLimit}`;

    if (Number.isInteger(inputAsNumber)) return inputAsNumber.toLocaleString("en-US", {
      maximumFractionDigits: forcedIntegerDecimals,
      minimumFractionDigits: forcedIntegerDecimals,
    });

    const numberWithSignificant = inputAsNumber.toLocaleString("en-US", {
      maximumSignificantDigits: maxSignificantDigits,
    });

    if (fixedDecimalDigits) {
      return Number(numberWithSignificant.replace(/,/g, "")).toLocaleString("en-US", {
        maximumFractionDigits: fixedDecimalDigits,
      });
    }

    return numberWithSignificant;
  }

  return convertToKMB(inputNumber.toString(), {
    isIgnoreKFormat: isIgnoreKFormat
  });
};

export const convertToKMB = (
  price: string,
  options?: {
    maximumFractionDigits?: number,
    minimumFractionDigits?: number,
    minimumSignificantDigits?: number,
    maximumSignificantDigits?: number,
    isIgnoreKFormat?: boolean,
    usd?: boolean,
    ignoreSmallValueFormat?: boolean,
    fixDisplayDecimals?: number,
  }): string => {
  if (Number.isNaN(Number(price.replace(/,/g, "")))) return "-";
  const numberPrice = Number(price.replace(/,/g, ""));

  const numberPriceAbs = Math.abs(Number(price.replace(/,/g, "")));
  const isNegative = numberPrice < 0;
  const negativeSymbol = isNegative ? "-" : "";

  const defaultMaximumSignificantDigits = 5;
  const isDefaultSignificantDigits = !options?.maximumFractionDigits && !options?.minimumFractionDigits;
  const maximumSignificantDigits = options?.maximumSignificantDigits || (isDefaultSignificantDigits ? defaultMaximumSignificantDigits : undefined);

  if (Number(numberPriceAbs) < 1000) {
    if (Number.isInteger(numberPrice)) return numberPrice.toLocaleString("en-US", {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    });
    if (!(options?.ignoreSmallValueFormat ?? false) && numberPrice < 0.000001 && numberPrice > 0) {
      return "<0.000001";
    }
    if (numberPrice < 1 && numberPrice >= 0) return `${Number(numberPrice.toFixed(options?.maximumSignificantDigits ?? 5))}`;

    let result = numberPrice.toLocaleString("en-US", {
      maximumSignificantDigits: maximumSignificantDigits,
      minimumSignificantDigits: options?.minimumSignificantDigits,
      maximumFractionDigits: options?.maximumFractionDigits,
      minimumFractionDigits: options?.minimumFractionDigits,
    });

    if (options?.fixDisplayDecimals) {
      result = Number(result.replace(/,/g, "")).toLocaleString("en-US", {
        maximumFractionDigits: options?.fixDisplayDecimals,
      });
    }

    // Remove trailing zeros
    if (result.includes(".")) return removeTrailingZeros(result);

    return result;
  }

  if (numberPriceAbs > 999.99 * 1e9) return "999.99B";

  if (numberPriceAbs >= 1e9) {
    return (
      negativeSymbol + (numberPriceAbs / 1e9).toLocaleString("en-US", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      }) + "B"
    );
  }
  if (numberPriceAbs >= 1e6) {
    return (
      negativeSymbol + (numberPriceAbs / 1e6).toLocaleString("en-US", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      }) + "M"
    );
  }
  if (numberPriceAbs >= 1e3 && !options?.isIgnoreKFormat) {
    return (
      negativeSymbol + (numberPriceAbs / 1e3).toLocaleString("en-US", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      }) + "K"
    );
  }

  return (Number.isInteger(price) ? `${numberPrice}` : numberPrice.toLocaleString("en-US", {
    maximumFractionDigits: options?.maximumFractionDigits ?? 2,
    minimumFractionDigits: options?.minimumFractionDigits ?? 2,
  }));
};

export const convertLiquidityUsdToKMB = (
  price: string,
  options?: {
    maximumFractionDigits?: number,
    minimumFractionDigits?: number,
    prefix?: string,
  }) => {
  const { prefix, maximumFractionDigits, minimumFractionDigits } = options ?? {};

  function withPrefix(value: string) {
    if (prefix) return prefix + value;

    return value;
  }

  if (Number.isNaN(Number(price))) return "-";

  if (Math.floor(Number(price)).toString().length < 4) {
    if (Number.isInteger(Number(price))) return withPrefix(`${Number(price)}`);
    if (Number(price) < 0.01 && Number(price) !== 0) return `<${prefix}0.01`;
    if (Number(price) < 1) return withPrefix(`${Number(Number(price).toFixed(6))}`);
    return withPrefix(Number(price).toLocaleString("en-US", {
      maximumFractionDigits: maximumFractionDigits ?? 2,
      minimumFractionDigits: minimumFractionDigits ?? 2,
    }));
  }

  const temp = Math.floor(Number(price));
  if (temp >= 1e9) {
    if (temp > 999.99 * 1e9) return withPrefix("999.99B");
    return withPrefix(
      (temp / 1e9).toLocaleString("en-US", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      }) + "B"
    );
  }
  if (temp >= 1e6) {
    return withPrefix(
      (temp / 1e6).toLocaleString("en-US", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      }) + "M"
    );
  }
  if (temp >= 1e3) {
    return withPrefix(
      (temp / 1e3).toLocaleString("en-US", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      }) + "K"
    );
  }
  return withPrefix(Number.isInteger(price) ? `${Number(price)}` : Number(price).toLocaleString("en-US", {
    maximumFractionDigits: maximumFractionDigits ?? 2,
    minimumFractionDigits: minimumFractionDigits ?? 2,
  }));
};

export const formatUsdNumber = (
  price: string,
  maximumFractionDigits?: number,
  isKMB?: boolean,
) => {
  if (convertToKMB(price, { maximumFractionDigits, isIgnoreKFormat: !isKMB }) === "-") {
    return "-";
  }

  return `$${convertToKMB(price, { maximumFractionDigits, isIgnoreKFormat: !isKMB })}`;
};

export function convertLiquidityUsdValue(value: number) {
  if (Number.isNaN(value)) return "-";

  const valueInNumber = Number(value);

  if (valueInNumber === 0) return "$0";

  if (valueInNumber > 0 && valueInNumber < 0.01) return "<$0.01";

  return "$" + BigNumber(value).toFormat(2);
}


