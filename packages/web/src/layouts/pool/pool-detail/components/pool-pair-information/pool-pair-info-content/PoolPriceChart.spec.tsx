import { render } from "@testing-library/react";

import type { NetworkClient } from "@common/clients/network-client";
import PriceCandleChart from "@components/common/price-candle-chart/PriceCandleChart";
import type { TokenModel } from "@models/token/token-model";

import PoolPriceChart from "./PoolPriceChart";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: { pair?: string; symbol?: string }) =>
      `${key}:${options?.pair ? `${options.pair}:` : ""}${options?.symbol ?? ""}`,
  }),
}));
jest.mock("@components/common/price-candle-chart/PriceCandleChart", () => ({
  __esModule: true,
  default: jest.fn(() => null),
}));

const tokenA = { decimals: 6, displaySymbol: "GNOT" } as TokenModel;
const tokenB = { decimals: 8, displaySymbol: "GNS" } as TokenModel;
const poolPath = "gno.land/r/demo/pool:42";

type ChartProps = {
  label: string;
  interval: number;
  volumeLabel: string;
  loadPage: (start: number, end: number) => Promise<
    { time: number; open: number; high: number; low: number; close: number; volume: number }[]
  >;
};
beforeEach(() => {
  jest.clearAllMocks();
});

it("requests aligned pool history and switches volume to the visible base token when reversed", async () => {
  const get = jest.fn().mockResolvedValue({
    data: {
      interval: 14400,
      start: 0,
      end: 28800,
      data: [
        {
          start: "1970-01-01T00:00:00Z",
          open: "1",
          high: "4",
          low: "0.5",
          close: "2",
          volume0: "4",
          volume1: "7",
        },
      ],
    },
  });
  const client = { get } as unknown as NetworkClient;
  const { rerender } = render(
    <PoolPriceChart client={client} poolPath={poolPath} tokenA={tokenA} tokenB={tokenB} reversed={false} range="4h" />,
  );
  let chart = (PriceCandleChart as jest.Mock).mock.calls[0][0] as ChartProps;
  expect(chart.interval).toBe(14400);
  expect(chart.label).toBe("Pool:chart.priceChartLabel:GNOT/GNS:GNOT");
  expect(chart.volumeLabel).toBe("Pool:chart.volumeToken:GNOT");
  expect((await chart.loadPage(0, 28800))[0]).toEqual({
    time: 0,
    open: 1,
    high: 4,
    low: 0.5,
    close: 2,
    volume: 4,
  });
  expect(get).toHaveBeenCalledWith({
    url: "/pools/gno.land%2Fr%2Fdemo%2Fpool%3A42/price/history?interval=14400&start=0&end=28800",
  });

  rerender(<PoolPriceChart client={client} poolPath={poolPath} tokenA={tokenA} tokenB={tokenB} reversed range="4h" />);
  chart = (PriceCandleChart as jest.Mock).mock.calls[1][0] as ChartProps;
  expect(chart.label).toBe("Pool:chart.priceChartLabel:GNS/GNOT:GNS");
  expect(chart.volumeLabel).toBe("Pool:chart.volumeToken:GNS");
  expect((await chart.loadPage(0, 28800))[0]).toEqual({
    time: 0,
    open: 1,
    high: 2,
    low: 0.25,
    close: 0.5,
    volume: 7,
  });
});

it("uses daily history directly for All", async () => {
  const get = jest.fn().mockResolvedValue({ data: { interval: 86400, start: 0, end: 86400, data: [] } });
  render(
    <PoolPriceChart
      client={{ get } as unknown as NetworkClient}
      poolPath={poolPath}
      tokenA={tokenA}
      tokenB={tokenB}
      reversed={false}
      range="All"
    />,
  );
  const chart = (PriceCandleChart as jest.Mock).mock.calls[0][0] as ChartProps;
  expect(chart.interval).toBe(86400);
  expect(await chart.loadPage(0, 86400)).toEqual([]);
  expect(get).toHaveBeenCalledWith({
    url: "/pools/gno.land%2Fr%2Fdemo%2Fpool%3A42/price/history?interval=86400&start=0&end=86400",
  });
});
