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
const history = { interval: 86400, start: 0, end: 3 * 86400, data: [candle] };

beforeEach(() => jest.clearAllMocks());

it.each([false, true])("requests and decodes full pool history (reversed=%s), then polls with bounds", async reversed => {
  const get = jest
    .fn()
    .mockResolvedValueOnce({ data: history })
    .mockResolvedValueOnce({ data: { ...history, start: 86400, end: 2 * 86400 } });
  const client = { get } as unknown as NetworkClient;
  render(<PoolPriceChart client={client} poolPath="gno.land/r/pool" tokenA={tokenA} tokenB={tokenB} reversed={reversed} range="All" />);
  const chart = mockChart.mock.calls[0][0] as {
    all: boolean;
    loadAll: () => Promise<PriceBar[]>;
    loadPage: (start: number, end: number) => Promise<PriceBar[]>;
  };

  expect(chart.all).toBe(true);
  expect(await chart.loadAll()).toEqual([
    reversed
      ? { time: 86400, open: 1, high: 2, low: 0.25, close: 0.5, volume: 24, quoteVolume: 12.5 }
      : { time: 86400, open: 1, high: 4, low: 0.5, close: 2, volume: 12.5, quoteVolume: 24 },
  ]);
  expect(get).toHaveBeenNthCalledWith(1, {
    url: "/pools/gno.land%2Fr%2Fpool/ohlcv?interval=86400&range=all",
  });
  await chart.loadPage(86400, 2 * 86400);
  expect(get).toHaveBeenNthCalledWith(2, {
    url: "/pools/gno.land%2Fr%2Fpool/ohlcv?interval=86400&start=86400&end=172800",
  });
});

it("rejects malformed full-history metadata and propagates request failures", async () => {
  const get = jest
    .fn()
    .mockResolvedValueOnce({ data: { ...history, start: 86400 } })
    .mockRejectedValueOnce(new Error("offline"));
  const client = { get } as unknown as NetworkClient;
  render(<PoolPriceChart client={client} poolPath="pool" tokenA={tokenA} tokenB={tokenB} reversed={false} range="All" />);
  const chart = mockChart.mock.calls[0][0] as { loadAll: () => Promise<PriceBar[]> };
  await expect(chart.loadAll()).rejects.toThrow("Invalid price history response");
  await expect(chart.loadAll()).rejects.toThrow("offline");
});
