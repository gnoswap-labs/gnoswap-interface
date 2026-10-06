import type { NetworkClient } from "@common/clients/network-client";

import { decodeTokenCandles, getTokenCandlePage } from "./token-candle-data";

const tokenPath = "gno.land/r/demo/token";
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
  data: [candle, { ...candle, start: "1970-01-01T03:00:00Z" }],
};

describe("token USD candles", () => {
  it("keeps UTC seconds and sparse intervals, including small USD prices and token-denominated volume", () => {
    expect(decodeTokenCandles(body, interval, start, end)).toEqual([
      { time: 3600, open: 1e-14, high: 4e-14, low: 1e-14, close: 3e-14, volume: 12.5 },
      { time: 10800, open: 1e-14, high: 4e-14, low: 1e-14, close: 3e-14, volume: 12.5 },
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

  it("requests the encoded token history route with explicit bounded windows", async () => {
    const get = jest.fn().mockResolvedValue({ data: body });
    const result = await getTokenCandlePage({ get } as unknown as NetworkClient, tokenPath, "1h", start, end);
    expect(result.map(bar => bar.time)).toEqual([3600, 10800]);
    expect(get).toHaveBeenCalledWith({
      url: "/tokens/gno.land%2Fr%2Fdemo%2Ftoken/price/history?interval=3600&start=0&end=14400",
    });
  });

  it("sources four-hour bars directly and pages All with daily intervals", async () => {
    const get = jest.fn().mockImplementation(({ url }: { url: string }) => {
      const params = new URL(url, "https://example.test").searchParams;
      return Promise.resolve({
        data: {
          interval: Number(params.get("interval")),
          start: Number(params.get("start")),
          end: Number(params.get("end")),
          data: [],
        },
      });
    });
    const client = { get } as unknown as NetworkClient;
    expect(await getTokenCandlePage(client, tokenPath, "4h", 0, 14400)).toEqual([]);
    expect(await getTokenCandlePage(client, tokenPath, "All", 0, 86400)).toEqual([]);
    expect(get.mock.calls.map(([request]) => request.url)).toEqual([
      "/tokens/gno.land%2Fr%2Fdemo%2Ftoken/price/history?interval=14400&start=0&end=14400",
      "/tokens/gno.land%2Fr%2Fdemo%2Ftoken/price/history?interval=86400&start=0&end=86400",
    ]);
  });
});
