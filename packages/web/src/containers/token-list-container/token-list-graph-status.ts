import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";
import { type Last7dPricePoint } from "@models/token/token-price-model";
import BigNumber from "bignumber.js";

const isUsablePricePoint = (item: Last7dPricePoint) => {
  const time = new Date(item.time).getTime();
  const price = BigNumber(item.price);

  return Number.isFinite(time) && item.price !== "" && !price.isNaN() && price.isFinite();
};

const isUsablePrice = (priceValue: BigNumber.Value) => {
  const price = BigNumber(priceValue);

  return !price.isNaN() && price.isFinite();
};

export const getLast7dGraphStatusFromPrices = (prices?: readonly BigNumber.Value[] | null): MATH_NEGATIVE_TYPE => {
  const usablePrices = (prices ?? []).filter(isUsablePrice);

  if (usablePrices.length === 0) {
    return MATH_NEGATIVE_TYPE.NONE;
  }

  const firstPrice = BigNumber(usablePrices[0]);
  const lastPrice = BigNumber(usablePrices[usablePrices.length - 1]);

  return firstPrice.isGreaterThan(lastPrice) ? MATH_NEGATIVE_TYPE.NEGATIVE : MATH_NEGATIVE_TYPE.POSITIVE;
};

export const getLast7dGraphStatus = (last7d?: readonly Last7dPricePoint[] | null): MATH_NEGATIVE_TYPE => {
  const sortedLast7d = [...(last7d ?? [])].sort(
    (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
  );
  const usableLast7d = sortedLast7d.filter(isUsablePricePoint);

  return getLast7dGraphStatusFromPrices(usableLast7d.map(item => item.price));
};
