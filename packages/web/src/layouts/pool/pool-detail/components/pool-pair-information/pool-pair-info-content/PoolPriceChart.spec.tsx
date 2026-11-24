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
  ["All", false],
  ["All", true],
  ["1d", false],
  ["1d", true],
] as const)("keeps pool %s history bounded (reversed=%s)", async (range, reversed) => {
  const get = jest.fn().mockResolvedValue({
    data: { interval: 86400, start: 86400, end: 2 * 86400, data: [candle] },
  });
  const client = { get } as unknown as NetworkClient;
  render(
    <PoolPriceChart
      client={client}
      poolPath="gno.land/r/pool"
      tokenA={tokenA}
      tokenB={tokenB}
      reversed={reversed}
      range={range}
    />,
  );
  const chart = mockChart.mock.calls[0][0] as {
    all: boolean;
    loadPage: (start: number, end: number) => Promise<PriceBar[]>;
  };

  expect(chart.all).toBe(range === "All");
  expect(chart).not.toHaveProperty("loadAll");
  expect(await chart.loadPage(86400, 2 * 86400)).toEqual([
    reversed
      ? { time: 86400, open: 1, high: 2, low: 0.25, close: 0.5, volume: 24, quoteVolume: 12.5 }
      : { time: 86400, open: 1, high: 4, low: 0.5, close: 2, volume: 12.5, quoteVolume: 24 },
  ]);
  expect(get).toHaveBeenCalledWith({
    url: "/pools/gno.land%2Fr%2Fpool/ohlcv?interval=86400&start=86400&end=172800",
  });
});
