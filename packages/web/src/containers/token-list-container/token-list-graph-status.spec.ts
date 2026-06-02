import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";
import { type Last7dPricePoint } from "@models/token/token-price-model";
import { getLast7dGraphStatus } from "./token-list-graph-status";

describe("getLast7dGraphStatus", () => {
  it("returns NEGATIVE when chronological first price is greater than last price", () => {
    const last7d: Last7dPricePoint[] = [
      { time: "2026-01-01T00:00:00Z", price: "10.000000000000000001" },
      { time: "2026-01-02T00:00:00Z", price: "10.000000000000000000" },
    ];

    expect(getLast7dGraphStatus(last7d)).toBe(MATH_NEGATIVE_TYPE.NEGATIVE);
  });

  it("returns POSITIVE when chronological first price is less than last price", () => {
    const last7d: Last7dPricePoint[] = [
      { time: "2026-01-01T00:00:00Z", price: "1.25" },
      { time: "2026-01-02T00:00:00Z", price: "2.5" },
    ];

    expect(getLast7dGraphStatus(last7d)).toBe(MATH_NEGATIVE_TYPE.POSITIVE);
  });

  it("returns POSITIVE when chronological first price equals last price", () => {
    const last7d: Last7dPricePoint[] = [
      { time: "2026-01-01T00:00:00Z", price: "3.000" },
      { time: "2026-01-02T00:00:00Z", price: "3" },
    ];

    expect(getLast7dGraphStatus(last7d)).toBe(MATH_NEGATIVE_TYPE.POSITIVE);
  });

  it("sorts by time before comparing and does not mutate the input", () => {
    const last7d: Last7dPricePoint[] = [
      { time: "2026-01-03T00:00:00Z", price: "5" },
      { time: "2026-01-01T00:00:00Z", price: "10" },
      { time: "2026-01-02T00:00:00Z", price: "7" },
    ];
    const originalOrder = last7d.map(item => item.time);

    expect(getLast7dGraphStatus(last7d)).toBe(MATH_NEGATIVE_TYPE.NEGATIVE);
    expect(last7d.map(item => item.time)).toEqual(originalOrder);
  });

  it("returns NONE for empty last7d data", () => {
    expect(getLast7dGraphStatus([])).toBe(MATH_NEGATIVE_TYPE.NONE);
  });

  it("returns NONE when last7d has no usable prices", () => {
    const last7d: Last7dPricePoint[] = [
      { time: "2026-01-01T00:00:00Z", price: "" },
      { time: "2026-01-02T00:00:00Z", price: "not-a-number" },
    ];

    expect(getLast7dGraphStatus(last7d)).toBe(MATH_NEGATIVE_TYPE.NONE);
  });
});
