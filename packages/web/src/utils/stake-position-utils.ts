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

export const convertToKMB = (
  price: string,
  options?: {
    maximumFractionDigits?: number,
    minimumFractionDigits?: number,
    minimumSignificantDigits?: number,
    maximumSignificantDigits?: number,
    convertOffset?: number,
    forceFractionDigit?: number,
  }) => {
  console.log("🚀 ~ forceFractionDigit:", options?.forceFractionDigit);
  const shouldLog = (price === "999.999999");
  console.log("🚀 32424 ~ price:", price);
  console.log("🚀 32424 ~ price:", shouldLog);
  if (Number.isNaN(Number(price))) return "-";
  const numberPrice = Number(price);
  shouldLog && console.log("🚀 ~ numberPrice:", numberPrice);
  const numberPriceAbs = Math.abs(Number(price));
  const isNegative = numberPrice < 0;
  const negativeSymbol = isNegative ? "-" : "";

  const defaultMaximumSignificantDigits = 5;
  const isDefaultSignificantDigits = !options?.maximumFractionDigits && !options?.minimumFractionDigits;
  const maximumSignificantDigits = options?.maximumSignificantDigits || (isDefaultSignificantDigits ? defaultMaximumSignificantDigits : undefined);
  const convertOffset = options?.convertOffset || 999;
  const intPart = Math.trunc(numberPrice);
  shouldLog && console.log("🚀 ~ intPart: intPart", intPart.toString());
  shouldLog && console.log("🚀 ~ intPart: round", Math.round(numberPrice).toString());
  shouldLog && console.log("🚀 ~ intPart: numberPrice", numberPrice);
  shouldLog && console.log("🚀 ~ intPart: last", numberPrice.toFixed(2));

  if (Math.abs(intPart) <= convertOffset) {
    if (Number.isInteger(numberPrice)) return numberPrice.toLocaleString("en-US", {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    });
    if (intPart.toString().length < Math.round(numberPrice).toString().length) {
      return intPart + "." + numberPrice.toString().split(".")[1].substring(0, 2);
    }
    if (numberPrice < 0.000001 && numberPrice >= 0) return "0.000001";
    if (numberPrice < 1 && numberPrice >= 0) return `${Number(numberPrice.toFixed(6))}`;

    const result = numberPrice.toLocaleString("en-US", {
      maximumSignificantDigits: maximumSignificantDigits,
      minimumSignificantDigits: options?.minimumSignificantDigits,
      maximumFractionDigits: options?.maximumFractionDigits,
      minimumFractionDigits: options?.minimumFractionDigits,
    });

    function rmTrailingZeros(value: string) {
      if (value.includes(".")) return removeTrailingZeros(value);
      return options?.forceFractionDigit ? BigNumber(value).toFixed(options?.forceFractionDigit) : value;
    }

    function forceFractionDigit(value: string) {
      return options?.forceFractionDigit ? BigNumber(value).toFixed(options?.forceFractionDigit) : value;
    }

    return Number.isInteger(result) ? forceFractionDigit(result) : rmTrailingZeros(result);
  } else {
    const temp = numberPriceAbs;
    if (temp >= 1e9) {
      if (temp > 999.99 * 1e9) return "999.99B";
      return (
        negativeSymbol + (temp / 1e9).toLocaleString("en-US", {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        }) + "B"
      );
    }
    if (temp >= 1e6) {
      return (
        negativeSymbol + (temp / 1e6).toLocaleString("en-US", {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        }) + "M"
      );
    }
    if (temp >= 1e3) {
      shouldLog && console.log("🚀 ~ temp:", temp);
      shouldLog && console.log("🚀 ~ temp:", negativeSymbol + (temp / 1e3).toLocaleString("en-US", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      }) + "K");

      return (
        negativeSymbol + (temp / 1e3).toLocaleString("en-US", {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        }) + "K"
      );
    }

    shouldLog && console.log("23842374897", numberPrice.toLocaleString("en-US", {
      maximumFractionDigits: options?.maximumFractionDigits ?? 2,
      minimumFractionDigits: options?.minimumFractionDigits ?? 2,
    }));

    return (Number.isInteger(price) ? `${numberPrice}` : numberPrice.toLocaleString("en-US", {
      maximumFractionDigits: options?.maximumFractionDigits ?? 2,
      minimumFractionDigits: options?.minimumFractionDigits ?? 2,
    }));
  }
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
  const func = isKMB ? convertToKMB : convertToMB;
  if (func(price, maximumFractionDigits) === "-") {
    return "-";
  }
  return `$${func(price, maximumFractionDigits)}`;
};

export function convertLiquidityUsdValue(value: number) {
  if (Number.isNaN(value)) return "-";

  const valueInNumber = Number(value);

  if (valueInNumber === 0) return "$0";

  if (valueInNumber > 0 && valueInNumber < 0.01) return "<$0.01";

  return "$" + BigNumber(value).toFormat(2);
}


