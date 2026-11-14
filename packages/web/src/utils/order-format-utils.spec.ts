import {
  calculateDcaOrderEndAt,
  calculatePriceDeviation,
  formatBps,
  formatOrderAmount,
  formatOrderFee,
  formatOrderFeeUsd,
  formatOrderFullAmount,
  formatOrderPriceDeviation,
  formatOrderRate,
  formatOrderRelativeDuration,
  formatOrderRemainingTime,
  formatOrderRoi,
  formatOrderTimeUntil,
  trimFractionZeros,
} from "./order-format-utils";

const NOW = 1_794_000_000;
const MINUTE = 60;
const HOUR = 3_600;
const DAY = 86_400;

describe("order-format-utils", () => {
  it("trims fraction zeros and keeps suffixes", () => {
    expect(trimFractionZeros("12.00")).toBe("12");
    expect(trimFractionZeros("1.50K")).toBe("1.5K");
    expect(trimFractionZeros("1,000")).toBe("1,000");
    expect(trimFractionZeros("0.10")).toBe("0.1");
  });

  it("formats card amounts with two decimals, K/M/B and a lower bound", () => {
    expect(formatOrderAmount("632.129")).toBe("632.12");
    expect(formatOrderAmount("150")).toBe("150");
    expect(formatOrderAmount("9750")).toBe("9.75K");
    expect(formatOrderAmount("0.001")).toBe("<0.01");
    expect(formatOrderAmount("0")).toBe("0");
    expect(formatOrderAmount(null)).toBe("0");
  });

  it("formats modal amounts with every token decimal and no K/M/B", () => {
    expect(formatOrderFullAmount("106208.255", 6)).toBe("106,208.255");
    expect(formatOrderFullAmount("1.1234567", 6)).toBe("1.123456");
    expect(formatOrderFullAmount("0", 6)).toBe("0");
  });

  it("shows a charged fee to the last token decimal, and an unknown fee as a dash", () => {
    expect(formatOrderFee("0.018771", 6)).toBe("0.018771");
    expect(formatOrderFee("0.000001", 6)).toBe("0.000001");
    expect(formatOrderFee("0", 6)).toBe("0");
    expect(formatOrderFee(null, 6)).toBe("-");
  });

  it("values a fee at the current USD price only when there is both a fee and a price", () => {
    expect(formatOrderFeeUsd("2", "1.5")).toBe("$3");
    expect(formatOrderFeeUsd("0.000001", "1.5")).toBe("<$0.01");
    expect(formatOrderFeeUsd("0", "1.5")).toBeNull();
    expect(formatOrderFeeUsd(null, "1.5")).toBeNull();
    expect(formatOrderFeeUsd("2", null)).toBeNull();
  });

  it("formats rates", () => {
    expect(formatOrderRate("0.9213751")).toBe("0.921375");
    expect(formatOrderRate("1.04")).toBe("1.04");
    expect(formatOrderRate(null)).toBe("-");
  });

  it("formats ROI with a direction marker", () => {
    expect(formatOrderRoi(0)).toEqual({ text: "▴ 0.00%", isNegative: false });
    expect(formatOrderRoi(1.526)).toEqual({ text: "▴ 1.52%", isNegative: false });
    expect(formatOrderRoi(-0.4)).toEqual({ text: "▾ 0.40%", isNegative: true });
    expect(formatOrderRoi(null)).toBeNull();
  });

  it("formats basis points", () => {
    expect(formatBps(15)).toBe("0.15%");
    expect(formatBps(100)).toBe("1%");
  });

  it("measures a price against its reference as a signed fraction", () => {
    expect(calculatePriceDeviation("1.1", "1")).toBe(0.1);
    expect(calculatePriceDeviation("0.95", "1")).toBe(-0.05);
    expect(calculatePriceDeviation("1.2716", "1.2716")).toBe(0);
    expect(calculatePriceDeviation(12, "8")).toBe(0.5);
    // Both prices are cut to six significant digits, so a +10% preset lands a hair under 10%.
    expect(calculatePriceDeviation("0.135801", "0.123456")).toBeCloseTo(0.1, 4);
  });

  it.each([
    ["a missing reference", "1.1", null],
    ["an undefined reference", "1.1", undefined],
    ["an empty reference", "1.1", ""],
    ["a zero reference", "1.1", "0"],
    ["a negative reference", "1.1", "-1"],
    ["a non-numeric reference", "1.1", "NaN"],
    ["an infinite reference", "1.1", "Infinity"],
    ["an empty price", "", "1"],
    ["a zero price", "0", "1"],
    ["a negative price", "-1", "1"],
    ["an infinite price", "Infinity", "1"],
  ])("has no deviation for %s", (_, price, referencePrice) => {
    expect(calculatePriceDeviation(price, referencePrice)).toBeNull();
  });

  it("formats a deviation as a signed percentage in the locale", () => {
    expect(formatOrderPriceDeviation(0.1, "en")).toBe("+10%");
    expect(formatOrderPriceDeviation(-0.05, "en")).toBe("-5%");
    expect(formatOrderPriceDeviation(0.123456, "en")).toBe("+12.35%");
    expect(formatOrderPriceDeviation(0.099995, "en")).toBe("+10%");
    expect(formatOrderPriceDeviation(0.1, "ko")).toBe("+10%");
    expect(formatOrderPriceDeviation(0.1234, "fr")).toMatch(/^\+12,34\s%$/);
  });

  it("shows no sign for market equality or a deviation that rounds to nothing", () => {
    expect(formatOrderPriceDeviation(0, "en")).toBe("0%");
    expect(formatOrderPriceDeviation(0.00004, "en")).toBe("0%");
    expect(formatOrderPriceDeviation(-0.00004, "en")).toBe("0%");
  });

  it("has no deviation text without a usable deviation", () => {
    expect(formatOrderPriceDeviation(null, "en")).toBeNull();
    expect(formatOrderPriceDeviation(undefined, "en")).toBeNull();
    expect(formatOrderPriceDeviation(Number.NaN, "en")).toBeNull();
    expect(formatOrderPriceDeviation(Number.POSITIVE_INFINITY, "en")).toBeNull();
  });

  it.each([
    [3_600, "in 1 hour"],
    [86_400, "in 1 day"],
    [604_800, "in 1 week"],
    [1_209_600, "in 2 weeks"],
    // 30 days is not a whole number of weeks and a month has no fixed length, so it stays in days.
    [2_592_000, "in 30 days"],
    [5_400, "in 90 minutes"],
    [90, "in 90 seconds"],
  ])("describes %i seconds as %s", (durationSec, expected) => {
    expect(formatOrderRelativeDuration(durationSec, "en")).toBe(expected);
  });

  it("describes a duration in the locale", () => {
    expect(formatOrderRelativeDuration(604_800, "ko")).toBe("1주 후");
    expect(formatOrderRelativeDuration(2_592_000, "fr")).toBe("dans 30 jours");
  });

  it.each([0, -3_600, 90.5, Number.NaN, Number.POSITIVE_INFINITY])("has no duration text for %s", durationSec => {
    expect(formatOrderRelativeDuration(durationSec, "en")).toBeNull();
  });

  describe("DCA order end", () => {
    it("is the next execution when no round follows it", () => {
      expect(calculateDcaOrderEndAt({ nextExecutionAt: 1_000, interval: 60, remainingCount: 1 })).toBe(1_000);
    });

    it("adds one interval for each round after the next execution", () => {
      expect(calculateDcaOrderEndAt({ nextExecutionAt: 1_000, interval: 3_600, remainingCount: 4 })).toBe(11_800);
    });

    it.each<[string, Parameters<typeof calculateDcaOrderEndAt>[0]]>([
      ["no next execution is known", { nextExecutionAt: null, interval: 60, remainingCount: 3 }],
      ["the next execution is zero", { nextExecutionAt: 0, interval: 60, remainingCount: 3 }],
      ["no round is left", { nextExecutionAt: 1_000, interval: 60, remainingCount: 0 }],
      ["the rounds left are not a whole number", { nextExecutionAt: 1_000, interval: 60, remainingCount: 2.5 }],
      ["the interval is zero", { nextExecutionAt: 1_000, interval: 0, remainingCount: 3 }],
      ["a value is not a number", { nextExecutionAt: Number.NaN, interval: 60, remainingCount: 3 }],
    ])("has no end when %s", (_, order) => {
      expect(calculateDcaOrderEndAt(order)).toBeNull();
    });
  });

  describe("remaining time", () => {
    it.each([
      [2 * DAY + 3 * HOUR + 15 * MINUTE, "2d 3h 15m"],
      // A unit that is zero is left out.
      [2 * DAY + 15 * MINUTE, "2d 15m"],
      [HOUR, "1h"],
      // A started minute counts as a whole one: never `0m` with time left.
      [1, "1m"],
      [MINUTE, "1m"],
      [MINUTE + 1, "2m"],
      [HOUR + 1, "1h 1m"],
      // A month has no fixed length, so 30 days stays in days.
      [30 * DAY, "30d"],
    ])("counts down %i seconds as %s", (seconds, expected) => {
      expect(formatOrderRemainingTime(NOW + seconds, "en", NOW)).toBe(expected);
    });

    it("counts down in the locale", () => {
      expect(formatOrderRemainingTime(NOW + 2 * DAY + 3 * HOUR + 15 * MINUTE, "ko", NOW)).toBe("2일 3시간 15분");
    });

    it.each([null, undefined, NOW, NOW - HOUR, Number.NaN, Number.POSITIVE_INFINITY])(
      "has no countdown to an end of %s",
      endAt => {
        expect(formatOrderRemainingTime(endAt, "en", NOW)).toBeNull();
      },
    );
  });

  describe("time until", () => {
    it.each([
      [1, "in 1 minute"],
      [89, "in 1 minute"],
      [90, "in 2 minutes"],
      [59 * MINUTE + 29, "in 59 minutes"],
      // Rounded in minutes these would read `in 60 minutes` and `in 24 hours`, so the larger unit takes over.
      [59 * MINUTE + 30, "in 1 hour"],
      [HOUR + 29 * MINUTE + 59, "in 1 hour"],
      [HOUR + 30 * MINUTE, "in 2 hours"],
      [23 * HOUR + 29 * MINUTE + 59, "in 23 hours"],
      [23 * HOUR + 30 * MINUTE, "in 1 day"],
      [DAY, "in 1 day"],
      [DAY + 12 * HOUR - 1, "in 1 day"],
      [DAY + 12 * HOUR, "in 2 days"],
      // A month has no fixed length, so 30 days stays in days.
      [30 * DAY, "in 30 days"],
    ])("describes %i seconds ahead as %s", (seconds, expected) => {
      expect(formatOrderTimeUntil(NOW + seconds, "en", NOW)).toBe(expected);
    });

    it("describes the distance in the locale", () => {
      expect(formatOrderTimeUntil(NOW + DAY, "ko", NOW)).toBe("1일 후");
      expect(formatOrderTimeUntil(NOW + 30 * DAY, "fr", NOW)).toBe("dans 30 jours");
    });

    it.each([null, undefined, NOW, NOW - HOUR, Number.NaN, Number.POSITIVE_INFINITY])(
      "has no distance to an end of %s",
      endAt => {
        expect(formatOrderTimeUntil(endAt, "en", NOW)).toBeNull();
      },
    );
  });

  it("counts from the current time unless one is given", () => {
    jest.useFakeTimers();
    jest.setSystemTime(NOW * 1000);
    try {
      expect(formatOrderRemainingTime(NOW + HOUR, "en")).toBe("1h");
      expect(formatOrderTimeUntil(NOW + DAY, "en")).toBe("in 1 day");
    } finally {
      jest.useRealTimers();
    }
  });
});
