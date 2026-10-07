import { decodeHistory } from "./price-chart-data";

const interval = 300;
const start = 300;
const end = 1200;
const candle = {
  start: "1970-01-01T00:05:00Z",
  open: "1",
  high: "4",
  low: "0.5",
  close: "2",
  volume0: "12.5",
  volume1: "24",
  tradeCount: 2,
};
const history = {
  interval,
  start,
  end,
  data: [candle, { ...candle, start: "1970-01-01T00:15:00Z" }],
};
const decode = (body: typeof history, reversed = false) => decodeHistory(body, reversed, interval, start, end);

describe("pool price candle conversion", () => {
  it("uses the API's whole-token prices directly, reverses extrema, and selects the visible base token volume", () => {
    expect(decode(history)).toEqual([
      { time: 300, open: 1, high: 4, low: 0.5, close: 2, volume: 12.5, quoteVolume: 24, tradeCount: 2 },
      { time: 900, open: 1, high: 4, low: 0.5, close: 2, volume: 12.5, quoteVolume: 24, tradeCount: 2 },
    ]);
    expect(decode(history, true)).toEqual([
      { time: 300, open: 1, high: 2, low: 0.25, close: 0.5, volume: 24, quoteVolume: 12.5, tradeCount: 2 },
      { time: 900, open: 1, high: 2, low: 0.25, close: 0.5, volume: 24, quoteVolume: 12.5, tradeCount: 2 },
    ]);
  });

  it("accepts empty windows and rejects mismatched metadata, bad UTC starts, and unordered buckets", () => {
    expect(decode({ ...history, data: [] })).toEqual([]);
    expect(() => decode({ ...history, interval: 3600 })).toThrow("Invalid price history response");
    expect(() => decode({ ...history, end: 1500 })).toThrow("Invalid price history response");
    for (const invalid of ["1970-01-01T00:20:00Z", "1970-01-01T00:05:00+00:00", "1970-01-01T00:06:00Z"]) {
      expect(() => decode({ ...history, data: [{ ...candle, start: invalid }] })).toThrow(
        "Invalid price history response",
      );
    }
    expect(() => decode({ ...history, data: [candle, candle] })).toThrow("Invalid price history response");
  });

  it("rejects invalid amounts and prices outside the chart number range", () => {
    expect(() => decode({ ...history, data: [{ ...candle, volume0: "-1" }] })).toThrow(
      "Invalid price history response",
    );
    expect(() => decode({ ...history, data: [{ ...candle, high: "1" }] })).toThrow("Price history cannot be displayed");
    const tinyPrice = `0.${"0".repeat(319)}1`;
    const tiny = { ...candle, open: tinyPrice, high: tinyPrice, low: tinyPrice, close: tinyPrice };
    expect(() => decode({ ...history, data: [tiny] }, true)).toThrow("Price history cannot be displayed");
    const underflow = `0.${"0".repeat(400)}1`;
    expect(() => decode({ ...history, data: [{ ...tiny, open: underflow }] })).toThrow(
      "Price history cannot be displayed",
    );
    expect(() => decode({ ...history, data: [{ ...candle, tradeCount: -1 }] })).toThrow(
      "Price history cannot be displayed",
    );
  });
});
