import { GNOT_TOKEN } from "@common/values/token-constant";
import { WRAPPED_GNOT_PATH } from "@constants/environment.constant";
import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";
import { TokenModel } from "@models/token/token-model";
import BigNumber from "bignumber.js";
import { formatPrice, formatRate } from "./new-number-utils";

export function wait<T>(runner: () => Promise<T>, waitTime = 1000, finishTime = 10000) {
  return new Promise<T | null>(resolve => {
    let finishedResult = false;
    let result: T | null = null;
    let currentTime = 0;

    runner().then(response => {
      result = response;
      finishedResult = true;
    });

    const interval = setInterval(() => {
      if (finishedResult && currentTime >= waitTime) {
        clearInterval(interval);
        resolve(result);
      }

      if (currentTime >= finishTime) {
        clearInterval(interval);
        resolve(null);
      }
      currentTime += 500;
    }, 500);
  });
}

export function delay<T = void>(ms: number, returnValue?: T): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(returnValue as T), ms));
}

export function makeId(value: string) {
  return encodeURIComponent(value);
}

export function encryptId(value: string) {
  return decodeURIComponent(value);
}

export function makeRandomId() {
  return Math.random() * 19999;
}

export const parseJson = (data: string) => {
  try {
    const jsonData = JSON.parse(data);
    return jsonData;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const checkPositivePrice = (
  currentPrice: string,
  checkPrice: string,
  {
    shortenSmallPercent = false,
    shortenSmallChange = false,
    displayStatusSign = true,
  }: {
    shortenSmallPercent?: boolean;
    shortenSmallChange?: boolean;
    displayStatusSign?: boolean;
  } = {},
) => {
  const currentAsNumber = Number(currentPrice);
  const checkAsNumber = Number(checkPrice);
  const percentValue = (() => {
    if (currentAsNumber === checkAsNumber) {
      return "0";
    }

    if (checkAsNumber > currentAsNumber) {
      if (currentAsNumber === 0) {
        return (100).toFixed();
      }
    }

    if (checkAsNumber === 0) {
      return "Infinity";
    }

    return BigNumber(currentAsNumber).dividedBy(checkAsNumber).minus(1).multipliedBy(100).abs().toFixed();
  })();

  const isEmpty = !currentPrice || !checkPrice;

  const status = (() => {
    if (isEmpty) {
      return MATH_NEGATIVE_TYPE.NONE;
    }

    if (currentAsNumber >= checkAsNumber) {
      return MATH_NEGATIVE_TYPE.POSITIVE;
    }

    return MATH_NEGATIVE_TYPE.NEGATIVE;
  })();

  const statusSign = displayStatusSign ? (status === MATH_NEGATIVE_TYPE.NEGATIVE ? "-" : "+") : "";

  const percentDisplay = (() => {
    if (status === MATH_NEGATIVE_TYPE.NONE) return "-";

    if (percentValue.includes("Infinity")) {
      return statusSign + "0.00%";
    }

    if (Number(percentValue) < 0.01) {
      if (shortenSmallPercent) {
        return statusSign + "<0.01%";
      }

      return statusSign + "0.00%";
    }

    return statusSign + formatRate(percentValue);
  })();
  const price = (() => {
    if (status === MATH_NEGATIVE_TYPE.NONE) {
      return "-";
    }

    if (Number(percentValue) < 0.01) {
      if (shortenSmallChange) {
        return statusSign + "0.00";
      }

      return (
        statusSign +
        formatPrice(BigNumber(checkAsNumber).minus(currentAsNumber).abs(), {
          isKMB: false,
        })
      );
    }

    return (
      statusSign +
      formatPrice(BigNumber(checkAsNumber).minus(currentAsNumber).abs(), {
        usd: true,
        isKMB: false,
      })
    );
  })();

  return {
    status: status,
    isEmpty: isEmpty,
    percentDisplay: percentDisplay,
    price: price,
  };
};

export function generateDateSequence(startDateString: string, endDateString: string, space: number) {
  const startDate = new Date(startDateString);
  if (startDate.getMinutes() !== 0) {
    startDate.setMinutes(0);
  }
  startDate.setHours(startDate.getHours() + 2);

  const lastDate = new Date(endDateString);
  const temp = [];
  while (startDate <= lastDate) {
    temp.push(new Date(startDate.toLocaleString("en-US")));
    startDate.setHours(startDate.getHours() + space);
  }
  return temp;
}

export function countPoints(startDateTime: string, endDateTime: string, intervalMinutes: number): number {
  const startDate = new Date(startDateTime);
  const endDate = new Date(endDateTime);

  const currentDateTime = new Date(startDate);

  let count = 0;

  while (currentDateTime < endDate) {
    count++;
    currentDateTime.setMinutes(currentDateTime.getMinutes() + intervalMinutes);
  }

  return count;
}

export function randomData() {
  const startDate = new Date("2023-12-12 01:10:00");
  const lastDate = new Date("2023-12-13 01:00:00");
  const temp = [];
  while (startDate <= lastDate) {
    const year = startDate.getFullYear();
    const month = String(startDate.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
    const day = String(startDate.getDate()).padStart(2, "0");
    const hours = String(startDate.getHours()).padStart(2, "0");
    const minutes = String(startDate.getMinutes()).padStart(2, "0");
    const seconds = String(startDate.getSeconds()).padStart(2, "0");
    temp.push({
      price: "0.500041",
      date: `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`,
    });
    startDate.setMinutes(startDate.getMinutes() + 10);
  }
  return temp;
}

export const checkGnotPath = (path: string) => {
  if (path === GNOT_TOKEN.path) {
    return WRAPPED_GNOT_PATH;
  } else {
    return path;
  }
};

export const isGNOTPath = (path: string) => {
  return path === WRAPPED_GNOT_PATH || path === GNOT_TOKEN.path;
};

export const isWrapped = (path: string) => {
  return path === WRAPPED_GNOT_PATH;
};

export const toNativePath = (path: string) => {
  if (isWrapped(path)) {
    return GNOT_TOKEN.path;
  } else {
    return path;
  }
};

export const isNativeToken = (path: string): boolean => {
  return path === GNOT_TOKEN.path;
};

export const isSameToken = (tokenAPath: string, tokenBPath: string): boolean => {
  if (!tokenAPath || !tokenBPath) return false;
  if (tokenAPath === tokenBPath) return true;
  if (isGNOTPath(tokenAPath) && isGNOTPath(tokenBPath)) return true;
  return false;
};

export function removeDuplicatesByWrappedPath(arr: TokenModel[]) {
  const seen = new Set();
  return arr.filter(obj => {
    const path = obj.path;
    if (!seen.has(path)) {
      seen.add(path);
      return true;
    }
    return false;
  });
}

/**
 * Wraps the native token path based on the provided path.
 *
 * If the input `path` matches the native token path, it returns the wrapped paths.
 * Otherwise, it returns the original `path`.
 *
 * @param {string} path - The token path to be processed.
 * @returns {string} The wrapped path if the input is native token path; otherwise, the original path.
 */
export const wrapNativeTokenPath = (path: string) => {
  if (path === GNOT_TOKEN.path) {
    return WRAPPED_GNOT_PATH;
  } else {
    return path;
  }
};

const PRICE_PREFIX_SYMBOL_MAP: Record<string, string> = {
  approx: "≈",
  usd: "$",
};
/**
 * Helper to build the prefix string based on usd and approx flags.
 */
export function buildPricePrefix(flags: Partial<Record<keyof typeof PRICE_PREFIX_SYMBOL_MAP, boolean>>): string {
  return (Object.keys(PRICE_PREFIX_SYMBOL_MAP) as Array<keyof typeof PRICE_PREFIX_SYMBOL_MAP>)
    .filter(key => flags[key])
    .map(key => PRICE_PREFIX_SYMBOL_MAP[key])
    .join("");
}

/**
 * Generates a unique ID for JSON-RPC requests.
 *
 * Combines a timestamp with a cryptographically secure random value
 * to ensure time ordering while preventing collisions during concurrent requests.
 */
export function generateJsonRpcRequestId(): number {
  const timestamp = Date.now();
  const array = new Uint16Array(1);
  crypto.getRandomValues(array);
  return timestamp * 100000 + array[0];
}
