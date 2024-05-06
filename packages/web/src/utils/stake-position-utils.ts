import BigNumber from "bignumber.js";
import { removeTrailingZeros } from "./number-utils";

export const convertToMB = (price: string, maximumFractionDigits?: number) => {
  if (Number.isNaN(Number(price))) return "-";
  if (Math.floor(Number(price)).toString().length < 7) {
    if (Number(price) < 1) return Number(price).toString();
    if (Number.isInteger(Number(price))) return Number(price).toString();
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
}) => {
  if (Number.isNaN(Number(price))) return "-";
  
  const maximumSignificantDigits = options?.maximumSignificantDigits || 5;
  const convertOffset = 999;
  const intPart = Math.trunc(Number(price));
  
  if (intPart < convertOffset) {
    if (Number.isInteger(Number(price))) return `${Number(price)}`;
    if (Number(price) < 0.000001 && Number(price) !== 0) return "0.000001";
    if (Number(price) < 1) return `${Number(Number(price).toFixed(6))}`;
    
    const result = removeTrailingZeros(Number(price).toLocaleString("en-US", {
      maximumSignificantDigits: maximumSignificantDigits,
      minimumSignificantDigits: options?.minimumSignificantDigits,
      maximumFractionDigits: options?.maximumFractionDigits,
      minimumFractionDigits: options?.minimumFractionDigits,
    }));
    console.log("🚀 ~ result ~ result:", result);


    return result;
  } else {
    const temp = Math.floor(Number(price));
    if (temp >= 1e9) {
      if (temp > 999.99 * 1e9) return "999.99B";
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
    if (temp >= 1e3) {
      return (
        (temp / 1e3).toLocaleString("en-US", {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        }) + "K"
      );
    }
    return Number.isInteger(price) ? `${Number(price)}` : Number(price).toLocaleString("en-US", {
      maximumFractionDigits: options?.maximumFractionDigits ?? 2,
      minimumFractionDigits: options?.minimumFractionDigits ?? 2,
    });
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
    if(prefix) return prefix + value;

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
  if(Number.isNaN(value)) return "-";

  const valueInNumber = Number(value);

  if(valueInNumber === 0) return "$0";

  if(valueInNumber > 0 && valueInNumber < 0.01) return "<$0.01";

  return "$" + BigNumber(value).toFormat(2);
}


