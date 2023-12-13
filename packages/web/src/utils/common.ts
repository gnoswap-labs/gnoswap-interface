import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";
import * as CryptoJS from "crypto-js";
import { convertLargePrice } from "./stake-position-utils";

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
  return CryptoJS.SHA256(value).toString();
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

export const checkPositivePrice = (currentPrice: string, checkPrice: string, fixedPrice?: number) => {
  const currentToNumber = Number(currentPrice);
  const checkToNumber = Number(checkPrice);
  
  const value = checkPrice >= currentPrice ?
    ((currentToNumber / checkToNumber - 1) * 100).toFixed(2) :
    ((1 - currentToNumber / checkToNumber) * 100).toFixed(2);
    const isEmpty = !currentPrice || !checkPrice;
  const status = isEmpty ? MATH_NEGATIVE_TYPE.NONE :
  currentToNumber >= checkToNumber ? MATH_NEGATIVE_TYPE.POSITIVE : MATH_NEGATIVE_TYPE.NEGATIVE;
  const percent = status === MATH_NEGATIVE_TYPE.NONE ? "-" : `${status === MATH_NEGATIVE_TYPE.NEGATIVE ? "-" : "+"}${Math.abs(Number(value))}%`;
  const price = status === MATH_NEGATIVE_TYPE.NONE ? "-" : 
  `${status === MATH_NEGATIVE_TYPE.NEGATIVE ? "-" :"+"}$${convertLargePrice((Math.abs(checkToNumber - currentToNumber)).toString(), fixedPrice ?? 2)}`;
  return {
    status: status,
    value: value,
    isEmpty: isEmpty,
    percent: percent,
    price: price,
  };
};