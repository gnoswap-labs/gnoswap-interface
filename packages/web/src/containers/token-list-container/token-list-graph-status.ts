import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";
import BigNumber from "bignumber.js";

export interface Last7dPricePoint {
  time: string;
  price: string;
}

const isUsablePricePoint = (item: Last7dPricePoint) => {
  const time = new Date(item.time).getTime();
  const price = BigNumber(item.price);

  return Number.isFinite(time) && item.price !== "" && !price.isNaN() && price.isFinite();
};

export const getLast7dGraphStatus = (last7d?: readonly Last7dPricePoint[] | null): MATH_NEGATIVE_TYPE => {
  const sortedLast7d = [...(last7d ?? [])].sort(
    (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
  );
  const usableLast7d = sortedLast7d.filter(isUsablePricePoint);

  if (usableLast7d.length === 0) {
    return MATH_NEGATIVE_TYPE.NONE;
  }

  const firstPrice = BigNumber(usableLast7d[0].price);
  const lastPrice = BigNumber(usableLast7d[usableLast7d.length - 1].price);

  return firstPrice.isGreaterThan(lastPrice) ? MATH_NEGATIVE_TYPE.NEGATIVE : MATH_NEGATIVE_TYPE.POSITIVE;
};
