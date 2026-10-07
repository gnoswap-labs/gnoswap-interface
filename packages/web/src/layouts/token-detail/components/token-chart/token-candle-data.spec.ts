import { decodeTokenCandles } from "./token-candle-data";

const interval = 3600;
const start = 0;
const end = 14400;
const candle = {
  start: "1970-01-01T01:00:00Z",
  open: "0.00000000000001",
  high: "0.00000000000004",
  low: "0.00000000000001",
  close: "0.00000000000003",
  volume: "12.5",
};
const body = {
  interval,
  start,
  end,
  data: [candle, { ...candle, start: "1970-01-01T03:00:00Z", volume: "0" }],
};

describe("token USD candles", () => {
  it("keeps sparse sampled-price bars without swaps alongside token-denominated swap volume", () => {
    expect(decodeTokenCandles(body, interval, start, end)).toEqual([
      { time: 3600, open: 1e-14, high: 4e-14, low: 1e-14, close: 3e-14, volume: 12.5 },
      { time: 10800, open: 1e-14, high: 4e-14, low: 1e-14, close: 3e-14, volume: 0 },
    ]);
  });

  it("validates metadata, UTC window, ordering, OHLC and representable decimal amounts", () => {
    expect(decodeTokenCandles({ ...body, data: [] }, interval, start, end)).toEqual([]);
    expect(() => decodeTokenCandles({ ...body, interval: 300 }, interval, start, end)).toThrow();
    expect(() => decodeTokenCandles({ ...body, start: 3600 }, interval, start, end)).toThrow();
    for (const invalid of ["1970-01-01T04:00:00Z", "1970-01-01T01:00:00+00:00", "1970-01-01T01:01:00Z"]) {
      expect(() =>
        decodeTokenCandles({ ...body, data: [{ ...candle, start: invalid }] }, interval, start, end),
      ).toThrow();
    }
    expect(() => decodeTokenCandles({ ...body, data: [candle, candle] }, interval, start, end)).toThrow();
    expect(() =>
      decodeTokenCandles({ ...body, data: [{ ...candle, high: "0.00000000000002" }] }, interval, start, end),
    ).toThrow();
    expect(() =>
      decodeTokenCandles({ ...body, data: [{ ...candle, volume: "-3" }] }, interval, start, end),
    ).toThrow();
    expect(() =>
      decodeTokenCandles({ ...body, data: [{ ...candle, open: `0.${"0".repeat(400)}1` }] }, interval, start, end),
    ).toThrow();
  });

});
