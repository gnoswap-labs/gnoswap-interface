import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";
import { getLast7dGraphStatus } from "./token-list-graph-status";

describe("getLast7dGraphStatus", () => {
  it("returns NEGATIVE when appended latest price makes the rendered graph end lower", () => {
    const renderedPrices = [10, 12, 11, 8];

    expect(getLast7dGraphStatus(renderedPrices)).toBe(MATH_NEGATIVE_TYPE.NEGATIVE);
  });

  it("returns POSITIVE when appended latest price makes the rendered graph end higher", () => {
    const renderedPrices = [10, 8, 9, 12];

    expect(getLast7dGraphStatus(renderedPrices)).toBe(MATH_NEGATIVE_TYPE.POSITIVE);
  });

  it("returns POSITIVE when first price equals final price", () => {
    const renderedPrices = [3, 2, 3];

    expect(getLast7dGraphStatus(renderedPrices)).toBe(MATH_NEGATIVE_TYPE.POSITIVE);
  });

  it("returns NONE for empty rendered prices", () => {
    expect(getLast7dGraphStatus([])).toBe(MATH_NEGATIVE_TYPE.NONE);
  });

  it("returns NONE when rendered prices have no usable values", () => {
    const renderedPrices = [Number.NaN, Number.POSITIVE_INFINITY];

    expect(getLast7dGraphStatus(renderedPrices)).toBe(MATH_NEGATIVE_TYPE.NONE);
  });

  it("ignores unusable rendered prices before comparing the first and final usable values", () => {
    const renderedPrices = [Number.NaN, 5, Number.POSITIVE_INFINITY, 3];

    expect(getLast7dGraphStatus(renderedPrices)).toBe(MATH_NEGATIVE_TYPE.NEGATIVE);
  });
});
