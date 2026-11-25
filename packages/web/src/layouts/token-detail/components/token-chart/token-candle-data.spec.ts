import type { NetworkClient } from "@common/clients/network-client";

import { decodeTokenCandles, getAllTokenCandles, getTokenCandlePage } from "./token-candle-data";

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

  it("requests full daily history without bounds and keeps bounded All polling unchanged", async () => {
    const daily = {
      interval: 86400,
      start: 0,
      end: 3 * 86400,
      data: [{ ...candle, start: "1970-01-02T00:00:00Z" }],
    };
    const get = jest
      .fn()
      .mockResolvedValueOnce({ data: daily })
      .mockResolvedValueOnce({ data: { ...daily, start: 86400, end: 2 * 86400 } });
    const client = { get } as unknown as NetworkClient;

    expect(await getAllTokenCandles(client, "gno.land/r/token")).toEqual([
      { time: 86400, open: 1e-14, high: 4e-14, low: 1e-14, close: 3e-14, volume: 12.5 },
    ]);
    expect(get).toHaveBeenNthCalledWith(1, {
      url: "/tokens/gno.land%2Fr%2Ftoken/ohlcv?interval=86400&range=all",
    });
    await getTokenCandlePage(client, "gno.land/r/token", "All", 86400, 2 * 86400);
    expect(get).toHaveBeenNthCalledWith(2, {
      url: "/tokens/gno.land%2Fr%2Ftoken/ohlcv?interval=86400&start=86400&end=172800",
    });
  });

  it("accepts empty full history and rejects invalid full-history metadata or candles", async () => {
    const daily = { interval: 86400, start: 0, end: 2 * 86400, data: [] };
    const get = jest.fn().mockResolvedValue({ data: daily });
    const client = { get } as unknown as NetworkClient;
    await expect(getAllTokenCandles(client, "token")).resolves.toEqual([]);
    for (const invalid of [
      { ...daily, start: 86400 },
      { ...daily, end: 0 },
      { ...daily, end: 86401 },
      { ...daily, interval: 3600 },
      { ...daily, data: [{ ...candle, start: "1970-01-03T00:00:00Z" }] },
    ]) {
      get.mockResolvedValueOnce({ data: invalid });
      await expect(getAllTokenCandles(client, "token")).rejects.toThrow();
    }
  });

});
