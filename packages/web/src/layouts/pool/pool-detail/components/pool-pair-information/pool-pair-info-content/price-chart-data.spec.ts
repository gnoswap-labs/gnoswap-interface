import type { TokenModel } from "@models/token/token-model";

import { decodeHistory } from "./price-chart-data";

const tokenA = { decimals: 6 } as TokenModel;
const tokenB = { decimals: 8 } as TokenModel;
const history = {
  s: "ok" as const,
  t: [300, 600],
  o: [100, 200],
  h: [400, 500],
  l: [50, 100],
  c: [200, 400],
  v: [0, 24],
};

describe("pool price candle conversion", () => {
  it("applies token decimals and reverses high and low without altering USD volume or UTC timestamps", () => {
    expect(decodeHistory(history, tokenA, tokenB, false)).toEqual([
      { time: 300, open: 1, high: 4, low: 0.5, close: 2, volume: 0 },
      { time: 600, open: 2, high: 5, low: 1, close: 4, volume: 24 },
    ]);
    expect(decodeHistory(history, tokenA, tokenB, true)).toEqual([
      { time: 300, open: 1, high: 2, low: 0.25, close: 0.5, volume: 0 },
      { time: 600, open: 0.5, high: 1, low: 0.2, close: 0.25, volume: 24 },
    ]);
  });

  it("preserves sparse buckets and rejects unequal arrays or out-of-order bars", () => {
    expect(decodeHistory({ ...history, t: [300, 900] }, tokenA, tokenB, false).map(bar => bar.time)).toEqual([
      300, 900,
    ]);
    expect(() => decodeHistory({ ...history, v: [3] }, tokenA, tokenB, false)).toThrow(
      "Invalid price history response",
    );
    expect(() => decodeHistory({ ...history, t: [600, 300] }, tokenA, tokenB, false)).toThrow(
      "Invalid price history response",
    );
  });
  it("rejects finite raw candles whose decimal conversion or reciprocal exceeds the chart number range", () => {
    const tiny = { s: "ok" as const, t: [300], o: [1e-100], h: [2e-100], l: [1e-100], c: [2e-100], v: [1] };
    const large = { s: "ok" as const, t: [300], o: [1e100], h: [2e100], l: [1e100], c: [2e100], v: [1] };
    expect(() => decodeHistory(tiny, { decimals: 0 } as TokenModel, { decimals: 300 } as TokenModel, false)).toThrow(
      "Price history cannot be displayed",
    );
    expect(() => decodeHistory(large, { decimals: 300 } as TokenModel, { decimals: 0 } as TokenModel, false)).toThrow(
      "Price history cannot be displayed",
    );
    expect(() => decodeHistory(tiny, { decimals: 0 } as TokenModel, { decimals: 220 } as TokenModel, true)).toThrow(
      "Price history cannot be displayed",
    );
  });
});
