import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";
import { WRAPPED_GNOT_PATH } from "@constants/environment.constant";
import { TokenModel } from "@models/token/token-model";
import { toPriceFormat } from "./number-utils";
import BigNumber from "bignumber.js";

export function wait<T>(
  runner: () => Promise<T>,
  waitTime = 1000,
  finishTime = 10000,
) {
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

export function makeId(value: string) {
  // return CryptoJS.SHA256(value, "gnot").toString();
  return value?.replace(/\//g, "_");
}

export function encryptId(value: string) {
  return (value || "").replace(/_/g, "/");
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
  } = {}
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

    return BigNumber(currentAsNumber)
      .dividedBy(checkAsNumber || 1)
      .minus(1)
      .multipliedBy(100)
      .abs()
      .toFixed();
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

    return statusSign + BigNumber(percentValue || 0).abs().toFixed(2) + "%";
  })();
  const price = (() => {
    if (status === MATH_NEGATIVE_TYPE.NONE) {
      return "-";
    }

    if (Number(percentValue) < 0.01) {
      if (shortenSmallChange) {
        return statusSign + "0.00";
      }

      return statusSign + toPriceFormat(
        BigNumber(checkAsNumber).minus(currentAsNumber).abs().toFixed(),
        {
          usd: true,
          isKMBFormat: false,
          fixedLessThan1Decimal: 3,
          forcedGreaterThan1Decimals: true,
        }
      );
    }

    return statusSign + toPriceFormat(
      BigNumber(checkAsNumber).minus(currentAsNumber).abs().toFixed(),
      {
        usd: true,
        isKMBFormat: false,
        fixedLessThan1Decimal: 3,
        forcedGreaterThan1Decimals: true,
      }
    );
  })();

  return {
    status: status,
    // percentValue: percentValue,
    isEmpty: isEmpty,
    percentDisplay: percentDisplay,
    price: price,
  };
};

export function generateDateSequence(
  startDateString: string,
  endDateString: string,
  space: number,
) {
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

export function countPoints(
  startDateTime: string,
  endDateTime: string,
  intervalMinutes: number,
): number {
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
  if (path === "gnot") {
    return WRAPPED_GNOT_PATH;
  } else {
    return path;
  }
};

export const isGNOTPath = (path: string) => {
  return path === WRAPPED_GNOT_PATH || path === "gnot";
};

export const isWrapped = (path: string) => {
  return path === WRAPPED_GNOT_PATH;
};

export const toNativePath = (path: string) => {
  if (isWrapped(path)) {
    return "gnot";
  } else {
    return path;
  }
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
