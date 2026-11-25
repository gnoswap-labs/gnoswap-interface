import { render } from "@testing-library/react";

import type { NetworkClient } from "@common/clients/network-client";
import type { PriceBar } from "@components/common/price-candle-chart/PriceCandleChart";

import TokenCandles from "./TokenCandles";

const mockChart = jest.fn<null, [unknown]>().mockReturnValue(null);
jest.mock("@components/common/price-candle-chart/PriceCandleChart", () => ({
  __esModule: true,
  default: (props: unknown) => mockChart(props),
}));
jest.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key: string) => key }) }));

beforeEach(() => jest.clearAllMocks());

it.each([
  ["5m", 300],
  ["1h", 3600],
  ["4h", 14400],
  ["1d", 86400],
  ["All", 86400],
] as const)("keeps %s polling bounded at the expected interval", async (resolution, interval) => {
  const get = jest.fn().mockResolvedValue({ data: { interval, start: 0, end: interval, data: [] } });
  const client = { get } as unknown as NetworkClient;
  render(<TokenCandles client={client} tokenPath="token/path" symbol="TKN" resolution={resolution} />);
  const chart = mockChart.mock.calls[0][0] as {
    daily: boolean;
    all: boolean;
    loadPage: (start: number, end: number) => Promise<PriceBar[]>;
  };
  expect(chart.daily).toBe(interval === 86400);
  expect(chart.all).toBe(resolution === "All");
  await expect(chart.loadPage(0, interval)).resolves.toEqual([]);
  expect(get).toHaveBeenCalledWith({
    url: `/tokens/token%2Fpath/ohlcv?interval=${interval}&start=0&end=${interval}`,
  });
});

it("wires the All selection to the full-history request", async () => {
  const get = jest.fn().mockResolvedValue({ data: { interval: 86400, start: 0, end: 86400, data: [] } });
  const client = { get } as unknown as NetworkClient;
  render(<TokenCandles client={client} tokenPath="token/path" symbol="TKN" resolution="All" />);
  const chart = mockChart.mock.calls[0][0] as { loadAll: () => Promise<PriceBar[]> };
  await expect(chart.loadAll()).resolves.toEqual([]);
  expect(get).toHaveBeenCalledWith({ url: "/tokens/token%2Fpath/ohlcv?interval=86400&range=all" });
});
