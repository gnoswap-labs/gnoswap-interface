import { render } from "@testing-library/react";

import type { NetworkClient } from "@common/clients/network-client";
import type { PriceBar } from "@components/common/price-candle-chart/PriceCandleChart";
import type { TokenModel } from "@models/token/token-model";

import PoolPriceChart from "./PoolPriceChart";

const mockChart = jest.fn<null, [unknown]>().mockReturnValue(null);
jest.mock("@components/common/price-candle-chart/PriceCandleChart", () => ({
  __esModule: true,
  default: (props: unknown) => mockChart(props),
}));
jest.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key: string) => key }) }));

const tokenA = { displaySymbol: "AAA" } as TokenModel;
const tokenB = { displaySymbol: "BBB" } as TokenModel;
const candle = {
  start: "1970-01-02T00:00:00Z",
  open: "1",
  high: "4",
  low: "0.5",
  close: "2",
  volume0: "12.5",
  volume1: "24",
};

beforeEach(() => jest.clearAllMocks());

it.each([
  ["5m", 300],
  ["1h", 3600],
  ["4h", 14400],
  ["1d", 86400],
  ["All", 86400],
] as const)("keeps pool %s polling bounded", async (range, interval) => {
  const end = 86400 + interval;
  const get = jest.fn().mockResolvedValue({
    data: { interval, start: 86400, end, data: [candle] },
  });
  const client = { get } as unknown as NetworkClient;
  render(
    <PoolPriceChart
      client={client}
      poolPath="gno.land/r/pool"
      tokenA={tokenA}
      tokenB={tokenB}
      reversed={false}
      range={range}
    />,
  );
  const chart = mockChart.mock.calls[0][0] as {
    all: boolean;
    loadPage: (start: number, end: number) => Promise<PriceBar[]>;
    loadAll: () => Promise<PriceBar[]>;
  };

  expect(chart.all).toBe(range === "All");
  expect(chart.loadAll).toEqual(expect.any(Function));
  expect(await chart.loadPage(86400, end)).toEqual([
    { time: 86400, open: 1, high: 4, low: 0.5, close: 2, volume: 12.5, quoteVolume: 24 },
  ]);
  expect(get).toHaveBeenCalledWith({
    url: `/pools/gno.land%2Fr%2Fpool/ohlcv?interval=${interval}&start=86400&end=${end}`,
  });
});

it.each([false, true])("loads complete pool history with correct prices and volumes (reversed=%s)", async reversed => {
  const later = { ...candle, start: "1970-03-02T00:00:00Z" };
  const history = { interval: 86400, start: 0, end: 101 * 86400, data: [candle, later] };
  const get = jest
    .fn()
    .mockResolvedValueOnce({ data: history })
    .mockResolvedValueOnce({ data: { ...history, start: 86400, end: 2 * 86400, data: [candle] } });
  const client = { get } as unknown as NetworkClient;
  render(
    <PoolPriceChart
      client={client}
      poolPath="gno.land/r/pool"
      tokenA={tokenA}
      tokenB={tokenB}
      reversed={reversed}
      range="All"
    />,
  );
  const chart = mockChart.mock.calls[0][0] as {
    all: boolean;
    loadAll: () => Promise<PriceBar[]>;
    loadPage: (start: number, end: number) => Promise<PriceBar[]>;
  };
  const first = reversed
    ? { time: 86400, open: 1, high: 2, low: 0.25, close: 0.5, volume: 24, quoteVolume: 12.5 }
    : { time: 86400, open: 1, high: 4, low: 0.5, close: 2, volume: 12.5, quoteVolume: 24 };

  expect(chart.all).toBe(true);
  expect(await chart.loadAll()).toEqual([first, { ...first, time: 60 * 86400 }]);
  expect(get).toHaveBeenNthCalledWith(1, {
    url: "/pools/gno.land%2Fr%2Fpool/ohlcv?interval=86400&range=all",
  });
  await expect(chart.loadPage(86400, 2 * 86400)).resolves.toEqual([first]);
  expect(get).toHaveBeenNthCalledWith(2, {
    url: "/pools/gno.land%2Fr%2Fpool/ohlcv?interval=86400&start=86400&end=172800",
  });
});

it("accepts empty full pool history and propagates invalid metadata, rows, and request failures", async () => {
  const history = { interval: 86400, start: 0, end: 2 * 86400, data: [] };
  const get = jest.fn().mockResolvedValue({ data: history });
  const client = { get } as unknown as NetworkClient;
  render(
    <PoolPriceChart client={client} poolPath="pool" tokenA={tokenA} tokenB={tokenB} reversed={false} range="All" />,
  );
  const chart = mockChart.mock.calls[0][0] as { loadAll: () => Promise<PriceBar[]> };
  await expect(chart.loadAll()).resolves.toEqual([]);
  for (const invalid of [
    { ...history, interval: 3600 },
    { ...history, start: 86400 },
    { ...history, end: 0 },
    { ...history, end: 86401 },
    { ...history, data: [{ ...candle, start: "1970-01-03T00:00:00Z" }] },
    { ...history, data: [candle, candle] },
    { ...history, data: [{ ...candle, high: "0.5" }] },
  ]) {
    get.mockResolvedValueOnce({ data: invalid });
    await expect(chart.loadAll()).rejects.toThrow();
  }
  get.mockRejectedValueOnce(new Error("offline"));
  await expect(chart.loadAll()).rejects.toThrow("offline");
});
