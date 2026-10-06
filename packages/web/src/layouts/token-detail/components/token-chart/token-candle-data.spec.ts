import type { NetworkClient } from "@common/clients/network-client";

import { decodeTokenCandles, getTokenCandlePage } from "./token-candle-data";

const tokenPath = "gno.land/r/demo/token";
const candle = {
  bucketStart: 3600,
  open: "0.00000000000001",
  high: "0.00000000000004",
  low: "0.00000000000001",
  close: "0.00000000000003",
  volumeUsd: "12.5",
};
const body = {
  message: "OK",
  data: { tokenPath, resolutionSeconds: 3600, candles: [candle, { ...candle, bucketStart: 10800 }] },
};

describe("token USD candles", () => {
  it("keeps UTC seconds and sparse intervals, including very small USD prices", () => {
    expect(decodeTokenCandles(body, tokenPath, "1h")).toEqual([
      { time: 3600, open: 1e-14, high: 4e-14, low: 1e-14, close: 3e-14, volume: 12.5 },
      { time: 10800, open: 1e-14, high: 4e-14, low: 1e-14, close: 3e-14, volume: 12.5 },
    ]);
  });

  it("rejects mismatched identity, ordering, malformed OHLC, and values outside chart number range", () => {
    expect(() => decodeTokenCandles(body, "other", "1h")).toThrow();
    expect(() => decodeTokenCandles(body, tokenPath, "1d")).toThrow();
    expect(() =>
      decodeTokenCandles({ ...body, data: { ...body.data, candles: [candle, candle] } }, tokenPath, "1h"),
    ).toThrow();
    expect(() =>
      decodeTokenCandles(
        { ...body, data: { ...body.data, candles: [{ ...candle, high: "0.00000000000002" }] } },
        tokenPath,
        "1h",
      ),
    ).toThrow();
    expect(() =>
      decodeTokenCandles(
        { ...body, data: { ...body.data, candles: [{ ...candle, open: `0.${"0".repeat(400)}1` }] } },
        tokenPath,
        "1h",
      ),
    ).toThrow();
  });

  it("requests an exclusive UTC cutoff with a single encoded token path segment", async () => {
    const get = jest.fn().mockResolvedValue({ data: body });
    const result = await getTokenCandlePage({ get } as unknown as NetworkClient, tokenPath, "1h", 14400);
    expect(result.map(bar => bar.time)).toEqual([3600, 10800]);
    const url = get.mock.calls[0][0].url as string;
    expect(url).toBe("/tokens/gno.land%2Fr%2Fdemo%2Ftoken/candles?resolution=1h&from=0&to=14400&countback=300");
  });
  it("rolls hourly OHLCV into aligned four-hour bars without losing the oldest partial group", async () => {
    const hourly = (
      bucketStart: number,
      open: string,
      high: string,
      low: string,
      close: string,
      volumeUsd: string,
    ) => ({
      bucketStart,
      open,
      high,
      low,
      close,
      volumeUsd,
    });
    const get = jest
      .fn()
      .mockResolvedValueOnce({
        data: {
          message: "OK",
          data: {
            tokenPath,
            resolutionSeconds: 3600,
            candles: [
              hourly(3600, "2", "3", "1", "2.5", "4"),
              hourly(7200, "2.5", "4", "2", "3", "5"),
              hourly(14400, "3", "5", "2.5", "4", "7"),
            ],
          },
        },
      })
      .mockResolvedValueOnce({
        data: {
          message: "OK",
          data: { tokenPath, resolutionSeconds: 3600, candles: [hourly(0, "1", "2", "0.5", "2", "3")] },
        },
      });
    expect(await getTokenCandlePage({ get } as unknown as NetworkClient, tokenPath, "4h", 18000)).toEqual([
      { time: 0, open: 1, high: 4, low: 0.5, close: 3, volume: 12 },
      { time: 14400, open: 3, high: 5, low: 2.5, close: 4, volume: 7 },
    ]);
    expect(get).toHaveBeenCalledTimes(2);
  });

  it("uses daily candles for All without changing the source OHLCV", async () => {
    const get = jest.fn().mockResolvedValue({
      data: {
        message: "OK",
        data: { tokenPath, resolutionSeconds: 86400, candles: [{ ...candle, bucketStart: 86400 }] },
      },
    });
    const bars = await getTokenCandlePage({ get } as unknown as NetworkClient, tokenPath, "All", 172800);
    expect(bars).toEqual([{ time: 86400, open: 1e-14, high: 4e-14, low: 1e-14, close: 3e-14, volume: 12.5 }]);
  });
});
