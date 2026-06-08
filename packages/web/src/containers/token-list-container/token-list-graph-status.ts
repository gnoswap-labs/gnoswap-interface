import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";
import BigNumber from "bignumber.js";

const isUsablePrice = (priceValue: BigNumber.Value) => {
  const price = BigNumber(priceValue);

  return !price.isNaN() && price.isFinite();
};

export const getLast7dGraphStatus = (prices?: readonly BigNumber.Value[] | null): MATH_NEGATIVE_TYPE => {
  const usablePrices = (prices ?? []).filter(isUsablePrice);

  if (usablePrices.length === 0) {
    return MATH_NEGATIVE_TYPE.NONE;
  }

  const firstPrice = BigNumber(usablePrices[0]);
  const lastPrice = BigNumber(usablePrices[usablePrices.length - 1]);

  return firstPrice.isGreaterThan(lastPrice) ? MATH_NEGATIVE_TYPE.NEGATIVE : MATH_NEGATIVE_TYPE.POSITIVE;
};
