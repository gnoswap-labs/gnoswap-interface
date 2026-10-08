import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { formatTokenExchangeRate } from "@utils/stake-position-utils";

import { formatTokenCandlePrice } from "@layouts/token-detail/components/token-chart/TokenCandles";

import PriceCandleChart, { type PriceBar } from "./PriceCandleChart";

const mockCandles = {
  applyOptions: jest.fn(),
  setData: jest.fn(),
  barsInLogicalRange: jest.fn().mockReturnValue({ barsBefore: 10 }),
};
const mockVolume = { setData: jest.fn() };
const mockTimeScale = {
  getVisibleRange: jest.fn().mockReturnValue({ from: 100, to: 200 }),
  setVisibleRange: jest.fn(),
  setVisibleLogicalRange: jest.fn(),
  subscribeVisibleLogicalRangeChange: jest.fn(),
  unsubscribeVisibleLogicalRangeChange: jest.fn(),
};
const mockSubscribeCrosshairMove = jest.fn();
const mockUnsubscribeCrosshairMove = jest.fn();
const mockCreateChart = jest.fn().mockImplementation(() => ({
  addSeries: jest.fn().mockReturnValueOnce(mockCandles).mockReturnValueOnce(mockVolume),
  priceScale: () => ({ applyOptions: jest.fn() }),
  timeScale: () => mockTimeScale,
  subscribeCrosshairMove: mockSubscribeCrosshairMove,
  unsubscribeCrosshairMove: mockUnsubscribeCrosshairMove,
  resize: jest.fn(),
  remove: jest.fn(),
}));

const mockTheme = {
  color: {
    green01: "green",
    red01: "red",
    background28: "black",
    background05: "gray",
    text04: "white",
    border14: "gray",
  },
};
jest.mock("@emotion/react", () => ({ useTheme: () => mockTheme }));
let mockLanguage = "en";
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: mockLanguage, resolvedLanguage: mockLanguage } }),
}));
jest.mock("./PriceCandleChart.styles", () => ({ CandleTooltip: "div" }));
jest.mock(
  "lightweight-charts",
  () => ({
    CandlestickSeries: "candles",
    HistogramSeries: "volume",
    TickMarkType: { Year: 0, Month: 1, DayOfMonth: 2, Time: 3, TimeWithSeconds: 4 },
    ColorType: { Solid: "solid" },
    createChart: (...args: unknown[]) => mockCreateChart(...args),
  }),
  { virtual: true },
);

const firstPage: PriceBar[] = [
  { time: 264600, open: 1, high: 2, low: 1, close: 2, volume: 3 },
  { time: 264900, open: 2, high: 3, low: 2, close: 3, volume: 4 },
];
const olderPage: PriceBar[] = [{ time: 264000, open: 1, high: 1, low: 1, close: 1, volume: 2 }];
const props = {
  identity: "pool",
  interval: 300,
  daily: false,
  label: "Price chart",
  volumeSymbols: ["GNOT", "GNS"] as const,
  formatCandlePrice: (value: number) => formatTokenExchangeRate(value, { maxSignificantDigits: 6, minLimit: 0.000001 }),
  loadingLabel: "Loading price history",
  emptyLabel: "No price history",
  searchOlderLabel: "Search older history",
  errorLabel: "Could not load price history",
  retryLabel: "Retry",
};

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    disconnect() {}
    unobserve() {}
  };
});

beforeEach(() => {
  jest.clearAllMocks();
  mockLanguage = "en";
  mockTimeScale.getVisibleRange.mockReturnValue({ from: 100, to: 200 });
  jest.spyOn(Date, "now").mockReturnValue(300000000);
});
afterEach(() => {
  jest.restoreAllMocks();
});

it("reveals the hovered candle's OHLC and both token volumes without a permanent volume caption", async () => {
  const bar = { ...firstPage[0], quoteVolume: 7 };
  render(<PriceCandleChart {...props} loadPage={jest.fn().mockResolvedValue([bar])} />);
  await waitFor(() => expect(mockCandles.setData).toHaveBeenCalledTimes(1));
  const onMove = mockSubscribeCrosshairMove.mock.calls[0][0];
  act(() => {
    onMove({
      point: { x: 40, y: 100 },
      time: bar.time,
      seriesData: new Map([
        [mockCandles, { time: bar.time, open: bar.open, high: bar.high, low: bar.low, close: bar.close }],
      ]),
    });
  });
  const tooltip = screen.getByRole("tooltip");
  expect(Array.from(tooltip.querySelectorAll("strong"), node => node.textContent)).toEqual([
    "2",
    "1",
    "1",
    "2",
    "3 GNOT",
    "7 GNS",
  ]);
  expect(screen.getAllByText("common:candleTooltip.volume")).toHaveLength(1);
  expect(screen.queryByText("Volume (GNOT)")).not.toBeInTheDocument();

  act(() => onMove({ point: undefined, time: undefined, seriesData: new Map() }));
  expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
});

it.each([
  {
    name: "token",
    formatCandlePrice: formatTokenCandlePrice,
    prices: ["2", "0.0012", "1.57", "0.987"],
  },
  {
    name: "pool",
    formatCandlePrice: (value: number) =>
      formatTokenExchangeRate(value, { maxSignificantDigits: 6, minLimit: 0.000001 }),
    prices: ["2", "0.0012", "1.57035", "0.987654"],
  },
])("formats $name candle prices without rounding the displayed volumes", async ({ formatCandlePrice, prices }) => {
  const bar = {
    time: firstPage[0].time,
    high: 2,
    low: 0.0012,
    open: 1.5703476164,
    close: 0.987654321,
    volume: 162.504458,
    quoteVolume: 100,
  };
  render(
    <PriceCandleChart {...props} formatCandlePrice={formatCandlePrice} loadPage={jest.fn().mockResolvedValue([bar])} />,
  );
  await waitFor(() => expect(mockCandles.setData).toHaveBeenCalledTimes(1));
  const axisFormat = mockCandles.applyOptions.mock.calls[0][0].priceFormat;
  expect(axisFormat.type).toBe("custom");
  expect(axisFormat.formatter(bar.open)).toBe(prices[2]);
  expect(axisFormat.tickmarksFormatter([0.0695, 0.07, 0.0705])).toEqual(["0.0695", "0.07", "0.0705"]);
  const onMove = mockSubscribeCrosshairMove.mock.calls[0][0];
  act(() => {
    onMove({
      point: { x: 40, y: 100 },
      time: bar.time,
      seriesData: new Map([[mockCandles, bar]]),
    });
  });
  expect(Array.from(screen.getByRole("tooltip").querySelectorAll("strong"), node => node.textContent)).toEqual([
    ...prices,
    "162.504458 GNOT",
    "100 GNS",
  ]);
});

it("preserves distinct token axis ticks when three significant digits would collapse them", async () => {
  const bar = { ...firstPage[0], open: 0.07, high: 0.07005, low: 0.06995, close: 0.07 };
  render(
    <PriceCandleChart
      {...props}
      formatCandlePrice={formatTokenCandlePrice}
      loadPage={jest.fn().mockResolvedValue([bar])}
    />,
  );
  await waitFor(() => expect(mockCandles.setData).toHaveBeenCalledTimes(1));
  const axisFormat = mockCandles.applyOptions.mock.calls[0][0].priceFormat;
  expect(axisFormat.minMove).toBe(0.000001);
  expect(axisFormat.formatter(0.07)).toBe("0.07");
  expect(axisFormat.tickmarksFormatter([0.06995, 0.07, 0.07005])).toEqual(["0.069950", "0.070000", "0.070050"]);
});

it("keeps loaded candles and the visible range after an older page fails, then retries on the next pan", async () => {
  const loadPage = jest
    .fn()
    .mockResolvedValueOnce(firstPage)
    .mockRejectedValueOnce(new Error("offline"))
    .mockResolvedValueOnce(olderPage);
  const { container } = render(<PriceCandleChart {...props} loadPage={loadPage} />);
  await waitFor(() => expect(mockCandles.setData).toHaveBeenCalledTimes(1));

  const panLeft = () => {
    act(() => {
      fireEvent.wheel(container.querySelector(".price-chart-canvas")!);
      const onRange = mockTimeScale.subscribeVisibleLogicalRangeChange.mock.calls[0][0];
      onRange({ from: 0, to: 10 });
    });
  };
  panLeft();
  await waitFor(() => expect(loadPage).toHaveBeenCalledTimes(2));
  await waitFor(() => expect(screen.getByText("Could not load price history")).toBeInTheDocument());
  expect(screen.queryByRole("button", { name: "Retry" })).not.toBeInTheDocument();
  expect(mockCandles.setData).toHaveBeenCalledTimes(1);
  expect(mockCreateChart).toHaveBeenCalledTimes(1);

  panLeft();
  await waitFor(() => expect(loadPage).toHaveBeenCalledTimes(3));
  await waitFor(() => expect(mockCandles.setData).toHaveBeenCalledTimes(2));
  expect(loadPage).toHaveBeenNthCalledWith(3, 228300, 264300);
  expect(mockTimeScale.setVisibleRange).toHaveBeenCalledWith({ from: 100, to: 200 });
  expect(screen.queryByText("Could not load price history")).not.toBeInTheDocument();
  expect(mockCreateChart).toHaveBeenCalledTimes(1);
});

it("keeps the loaded chart unobstructed while fetching an older page", async () => {
  let finish!: (bars: PriceBar[]) => void;
  const loadPage = jest
    .fn()
    .mockResolvedValueOnce(firstPage)
    .mockImplementationOnce(
      () =>
        new Promise<PriceBar[]>(resolve => {
          finish = resolve;
        }),
    );
  const { container } = render(<PriceCandleChart {...props} loadPage={loadPage} />);
  await waitFor(() => expect(mockCandles.setData).toHaveBeenCalledTimes(1));

  act(() => {
    fireEvent.wheel(container.querySelector(".price-chart-canvas")!);
    mockTimeScale.subscribeVisibleLogicalRangeChange.mock.calls[0][0]({ from: 0, to: 10 });
  });
  await waitFor(() => expect(loadPage).toHaveBeenCalledTimes(2));
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
  expect(mockCandles.setData).toHaveBeenCalledTimes(1);
  act(() => finish(olderPage));
  await waitFor(() => expect(mockCandles.setData).toHaveBeenCalledTimes(2));
});

it("offers a full retry when the initial history page fails", async () => {
  const loadPage = jest.fn().mockRejectedValueOnce(new Error("offline")).mockResolvedValueOnce(firstPage);
  render(<PriceCandleChart {...props} loadPage={loadPage} />);
  await screen.findByRole("button", { name: "Retry" });
  expect(mockCandles.setData).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Retry" }));
  await waitFor(() => expect(mockCandles.setData).toHaveBeenCalledTimes(1));
  expect(screen.queryByRole("button", { name: "Retry" })).not.toBeInTheDocument();
});

it("advances one bounded window per action across empty and sparse history without using candle time as the cursor", async () => {
  const sparse = [{ ...firstPage[0], time: 192600 }];
  const earlier = [{ ...olderPage[0], time: 120600 }];
  const loadPage = jest
    .fn()
    .mockResolvedValueOnce([])
    .mockResolvedValueOnce([])
    .mockResolvedValueOnce(sparse)
    .mockResolvedValueOnce([])
    .mockResolvedValueOnce(earlier);
  const { container } = render(<PriceCandleChart {...props} loadPage={loadPage} />);
  await screen.findByRole("button", { name: "Search older history" });
  expect(loadPage).toHaveBeenNthCalledWith(1, 264300, 300300);
  expect(loadPage).toHaveBeenCalledTimes(1);

  fireEvent.click(screen.getByRole("button", { name: "Search older history" }));
  await waitFor(() => expect(loadPage).toHaveBeenCalledTimes(2));
  await screen.findByRole("button", { name: "Search older history" });
  fireEvent.click(screen.getByRole("button", { name: "Search older history" }));
  await waitFor(() => expect(mockCandles.setData).toHaveBeenCalledTimes(1));
  expect(loadPage).toHaveBeenNthCalledWith(2, 228300, 264300);
  expect(loadPage).toHaveBeenNthCalledWith(3, 192300, 228300);

  const panLeft = () => {
    act(() => {
      fireEvent.wheel(container.querySelector(".price-chart-canvas")!);
      mockTimeScale.subscribeVisibleLogicalRangeChange.mock.calls[0][0]({ from: 0, to: 10 });
    });
  };
  panLeft();
  await waitFor(() => expect(loadPage).toHaveBeenCalledTimes(4));
  expect(mockCandles.setData).toHaveBeenCalledTimes(1);
  expect(loadPage).toHaveBeenNthCalledWith(4, 156300, 192300);
  panLeft();
  await waitFor(() => expect(mockCandles.setData).toHaveBeenCalledTimes(2));
  expect(loadPage).toHaveBeenNthCalledWith(5, 120300, 156300);
});

it("limits All daily requests to 30-day windows and pages older only on action", async () => {
  jest.spyOn(Date, "now").mockReturnValue(100 * 86400 * 1000);
  const loadPage = jest.fn().mockResolvedValue([]);
  render(<PriceCandleChart {...props} interval={86400} daily all loadPage={loadPage} />);
  await screen.findByRole("button", { name: "Search older history" });
  expect(loadPage).toHaveBeenCalledTimes(1);
  const [start, end] = loadPage.mock.calls[0];
  expect(end - start).toBe(30 * 86400);
  expect(start % 86400).toBe(0);
  fireEvent.click(screen.getByRole("button", { name: "Search older history" }));
  await waitFor(() => expect(loadPage).toHaveBeenCalledTimes(2));
  expect(loadPage).toHaveBeenNthCalledWith(2, start - 30 * 86400, start);
});

it("formats crosshair and ticks in the app language and browser local time", async () => {
  render(<PriceCandleChart {...props} loadPage={jest.fn().mockResolvedValue(firstPage)} />);
  await waitFor(() => expect(mockCandles.setData).toHaveBeenCalledTimes(1));
  const options = mockCreateChart.mock.calls[0][1];
  const time = Date.parse("2026-10-07T23:30:00Z") / 1000;
  const date = new Date(time * 1000);
  expect(options.localization.locale).toBe("en");
  expect(options.timeScale.tickMarkFormatter(time, 2, "ko-KR")).toBe(
    new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(date),
  );
  expect(options.localization.timeFormatter(time)).toBe(
    new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date),
  );
});

it("uses Korean local dates when the app language is Korean", async () => {
  mockLanguage = "ko";
  render(<PriceCandleChart {...props} daily loadPage={jest.fn().mockResolvedValue(firstPage)} />);
  await waitFor(() => expect(mockCandles.setData).toHaveBeenCalledTimes(1));
  const options = mockCreateChart.mock.calls[0][1];
  const time = Date.parse("2026-10-07T23:30:00Z") / 1000;
  const date = new Date(time * 1000);
  expect(options.timeScale.tickMarkFormatter(time, 2, "en-US")).toBe(
    new Intl.DateTimeFormat("ko", { month: "short", day: "numeric" }).format(date),
  );
  expect(options.localization.timeFormatter(time)).toBe(
    new Intl.DateTimeFormat("ko", { year: "numeric", month: "short", day: "numeric" }).format(date),
  );
});

it("rebuilds the chart and formats both volumes when the app language changes", async () => {
  const bar = { ...firstPage[0], volume: 1234.5, quoteVolume: 1234.5 };
  const loadPage = jest.fn().mockResolvedValue([bar]);
  const { rerender } = render(<PriceCandleChart {...props} loadPage={loadPage} />);
  await waitFor(() => expect(mockCandles.setData).toHaveBeenCalledTimes(1));

  mockLanguage = "fr";
  rerender(<PriceCandleChart {...props} loadPage={loadPage} />);
  await waitFor(() => expect(mockCandles.setData).toHaveBeenCalledTimes(2));
  expect(mockCreateChart.mock.calls[1][1].localization.locale).toBe("fr");

  act(() => {
    mockSubscribeCrosshairMove.mock.calls[1][0]({
      point: { x: 40, y: 100 },
      time: bar.time,
      seriesData: new Map([[mockCandles, bar]]),
    });
  });
  const localizedVolume = new Intl.NumberFormat("fr", { maximumSignificantDigits: 12 }).format(bar.volume);
  expect(Array.from(screen.getByRole("tooltip").querySelectorAll("strong"), node => node.textContent).slice(4)).toEqual(
    [`${localizedVolume} GNOT`, `${localizedVolume} GNS`],
  );
});

it("ends pool paging after the first empty older window following observed bars", async () => {
  const loadPage = jest.fn().mockResolvedValueOnce(firstPage).mockResolvedValue([]);
  const { container } = render(<PriceCandleChart {...props} stopAtEmptyOlderPage loadPage={loadPage} />);
  await waitFor(() => expect(mockCandles.setData).toHaveBeenCalledTimes(1));
  const panLeft = () => {
    act(() => {
      fireEvent.wheel(container.querySelector(".price-chart-canvas")!);
      mockTimeScale.subscribeVisibleLogicalRangeChange.mock.calls[0][0]({ from: 0, to: 10 });
    });
  };
  panLeft();
  await waitFor(() => expect(loadPage).toHaveBeenCalledTimes(2));
  await act(async () => {
    await Promise.resolve();
  });
  panLeft();
  expect(loadPage).toHaveBeenCalledTimes(2);
});

it("refreshes the latest candle and appends new buckets without discarding history or the viewport", async () => {
  jest.useFakeTimers();
  jest.setSystemTime(300000000);
  const recent = { ...firstPage[1], time: 300000 };
  const updated = { ...recent, high: 5, close: 4, volume: 8 };
  const next = { ...recent, time: 300300, open: 4, high: 6, close: 6, volume: 2 };
  const loadPage = jest.fn().mockResolvedValueOnce([firstPage[0], recent]).mockResolvedValueOnce([updated, next]);
  const { unmount } = render(<PriceCandleChart {...props} loadPage={loadPage} />);
  try {
    await act(async () => {});
    expect(mockCandles.setData).toHaveBeenCalledTimes(1);
    jest.setSystemTime(300300000);
    await act(async () => {
      jest.advanceTimersByTime(5_000);
    });
    expect(loadPage).toHaveBeenNthCalledWith(2, 300000, 300600);
    expect(mockCandles.setData).toHaveBeenLastCalledWith([
      { time: 264600, open: 1, high: 2, low: 1, close: 2 },
      { time: 300000, open: 2, high: 5, low: 2, close: 4 },
      { time: 300300, open: 4, high: 6, low: 2, close: 6 },
    ]);
    expect(mockVolume.setData.mock.calls.at(-1)[0].map((bar: { value: number }) => bar.value)).toEqual([3, 8, 2]);
    expect(mockTimeScale.setVisibleRange).toHaveBeenCalledWith({ from: 100, to: 200 });
    unmount();
    await act(async () => {
      jest.advanceTimersByTime(5_000);
    });
    expect(loadPage).toHaveBeenCalledTimes(2);
  } finally {
    unmount();
    jest.useRealTimers();
  }
});

it("pauses polling in hidden tabs and retains prices after a refresh failure until recovery", async () => {
  jest.useFakeTimers();
  jest.setSystemTime(300000000);
  let hidden = false;
  jest.spyOn(document, "hidden", "get").mockImplementation(() => hidden);
  const bar = { ...firstPage[1], time: 300000 };
  const loadPage = jest
    .fn()
    .mockResolvedValueOnce([bar])
    .mockRejectedValueOnce(new Error("offline"))
    .mockResolvedValueOnce([{ ...bar, close: 4, high: 4 }]);
  const { unmount } = render(<PriceCandleChart {...props} loadPage={loadPage} />);
  try {
    await act(async () => {});
    hidden = true;
    await act(async () => {
      jest.advanceTimersByTime(60_000);
    });
    expect(loadPage).toHaveBeenCalledTimes(1);
    hidden = false;
    await act(async () => {
      fireEvent(document, new Event("visibilitychange"));
    });
    expect(loadPage).toHaveBeenCalledTimes(2);
    expect(mockCandles.setData).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("Could not load price history")).not.toBeInTheDocument();
    await act(async () => {
      jest.advanceTimersByTime(5_000);
    });
    expect(mockCandles.setData).toHaveBeenLastCalledWith([{ time: 300000, open: 2, high: 4, low: 2, close: 4 }]);
  } finally {
    unmount();
    jest.useRealTimers();
  }
});
