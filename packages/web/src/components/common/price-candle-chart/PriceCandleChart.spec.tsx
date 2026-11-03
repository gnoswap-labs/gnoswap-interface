import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { formatTokenExchangeRate } from "@utils/stake-position-utils";

import { formatTokenCandlePrice } from "@layouts/token-detail/components/token-chart/TokenCandles";

import PriceCandleChart, { type PriceBar } from "./PriceCandleChart";

const mockCandles = {
  applyOptions: jest.fn(),
  setData: jest.fn(),
  update: jest.fn(),
  barsInLogicalRange: jest.fn().mockReturnValue({ barsBefore: 10 }),
  priceScale: () => mockPriceScale,
};
const mockVolume = { setData: jest.fn(), update: jest.fn(), priceScale: () => mockPriceScale };
const mockTimeScale = {
  getVisibleLogicalRange: jest.fn().mockReturnValue({ from: -4.25, to: 9.75 }),
  setVisibleLogicalRange: jest.fn(),
  fitContent: jest.fn(),
  scrollPosition: jest.fn().mockReturnValue(5),
  scrollToPosition: jest.fn(),
  height: jest.fn().mockReturnValue(28),
  subscribeVisibleLogicalRangeChange: jest.fn(),
  unsubscribeVisibleLogicalRangeChange: jest.fn(),
};
const mockSubscribeCrosshairMove = jest.fn();
const mockRemove = jest.fn();
const mockUnsubscribeCrosshairMove = jest.fn();
const mockPriceScale = {
  options: jest.fn().mockReturnValue({ autoScale: true }),
  applyOptions: jest.fn(),
  width: jest.fn().mockReturnValue(70),
};
const mockPanes = [
  { setStretchFactor: jest.fn(), getHTMLElement: jest.fn().mockReturnValue(null) },
  { setStretchFactor: jest.fn(), getHTMLElement: jest.fn().mockReturnValue(null) },
];
const mockCreateChart = jest.fn().mockImplementation(() => ({
  addSeries: jest.fn().mockReturnValueOnce(mockCandles).mockReturnValueOnce(mockVolume),
  priceScale: () => mockPriceScale,
  timeScale: () => mockTimeScale,
  panes: () => mockPanes,
  subscribeCrosshairMove: mockSubscribeCrosshairMove,
  unsubscribeCrosshairMove: mockUnsubscribeCrosshairMove,
  resize: jest.fn(),
  remove: mockRemove,
}));

const mockTheme = {
  color: {
    green01: "green",
    red01: "red",
    chartVolumeUp: "mint",
    chartVolumeDown: "coral",
    background28: "black",
    background05: "gray",
    text04: "white",
    border03: "gray",
    border14: "gray",
  },
};
jest.mock("@emotion/react", () => ({ useTheme: () => mockTheme }));
let mockLanguage = "en";
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: mockLanguage, resolvedLanguage: mockLanguage } }),
}));
jest.mock("./PriceCandleChart.styles", () => ({ CandleTooltip: "div", ChartNavigation: "div" }));
jest.mock("@components/common/loading-spinner/LoadingSpinner", () => ({
  __esModule: true,
  default: () => <span />,
}));
jest.mock(
  "lightweight-charts",
  () => ({
    CandlestickSeries: "candles",
    HistogramSeries: "volume",
    TickMarkType: { Year: 0, Month: 1, DayOfMonth: 2, Time: 3, TimeWithSeconds: 4 },
    ColorType: { Solid: "solid" },
    CrosshairMode: { Normal: 0 },
    createChart: (...args: unknown[]) => mockCreateChart(...args),
  }),
  { virtual: true },
);

const firstPage: PriceBar[] = [
  { time: 291600, open: 1, high: 2, low: 1, close: 2, volume: 3 },
  { time: 291900, open: 2, high: 3, low: 2, close: 3, volume: 4 },
];
const olderPage: PriceBar[] = [{ time: 282000, open: 1, high: 1, low: 1, close: 1, volume: 2 }];
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
  mockCandles.barsInLogicalRange.mockReset().mockReturnValue({ barsBefore: Infinity });
  mockTimeScale.getVisibleLogicalRange.mockReturnValue({ from: -4.25, to: 9.75 });
  mockTimeScale.scrollPosition.mockReset().mockReturnValue(5);
  mockTimeScale.setVisibleLogicalRange.mockReset();
  mockTimeScale.scrollToPosition.mockReset();
  mockPriceScale.options.mockReset().mockReturnValue({ autoScale: true });
  mockPriceScale.applyOptions.mockReset();
  jest.spyOn(Date, "now").mockReturnValue(300000000);
});
afterEach(() => {
  jest.restoreAllMocks();
});

it.each([[firstPage], [[]]])("keeps initial loading visible until the candle request settles", async result => {
  let resolvePage!: (bars: PriceBar[]) => void;
  const loadPage = jest.fn(
    () =>
      new Promise<PriceBar[]>(resolve => {
        resolvePage = resolve;
      }),
  );
  render(<PriceCandleChart {...props} loadPage={loadPage} />);
  await waitFor(() => expect(loadPage).toHaveBeenCalledTimes(1));
  expect(screen.getByRole("status")).toHaveAttribute("aria-label", props.loadingLabel);
  expect(screen.queryByText(props.loadingLabel)).not.toBeInTheDocument();
  expect(screen.queryByText(props.emptyLabel)).not.toBeInTheDocument();
  await act(async () => resolvePage(result));
  if (result.length) {
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  } else {
    expect(screen.getByRole("status")).toHaveTextContent(props.emptyLabel);
  }
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

it("portals candle details beyond clipping ancestors and keeps the measured tooltip inside the viewport", async () => {
  jest.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
    return this.getAttribute("role") === "tooltip"
      ? { left: 0, top: 0, width: 250, height: 150, right: 250, bottom: 150, x: 0, y: 0, toJSON() {} }
      : { left: 700, top: 500, width: 300, height: 200, right: 1000, bottom: 700, x: 700, y: 500, toJSON() {} };
  });
  const { container } = render(
    <div style={{ overflow: "hidden" }}>
      <PriceCandleChart {...props} loadPage={jest.fn().mockResolvedValue(firstPage)} />
    </div>,
  );
  await waitFor(() => expect(mockCandles.setData).toHaveBeenCalledTimes(1));
  const onMove = mockSubscribeCrosshairMove.mock.calls[0][0];
  act(() =>
    onMove({
      point: { x: 300, y: 200 },
      time: firstPage[0].time,
      seriesData: new Map<typeof mockCandles | typeof mockVolume, PriceBar | { time: number; value: number }>([
        [mockCandles, firstPage[0]],
        [mockVolume, { time: firstPage[0].time, value: firstPage[0].volume }],
      ]),
    }),
  );
  const tooltip = screen.getByRole("tooltip");
  expect(document.body).toContainElement(tooltip);
  expect(container).not.toContainElement(tooltip);
  expect(Number.parseFloat(tooltip.style.left)).toBeGreaterThanOrEqual(8);
  expect(Number.parseFloat(tooltip.style.left) + 250).toBeLessThanOrEqual(window.innerWidth - 8);
  expect(Number.parseFloat(tooltip.style.top) + 150).toBeLessThanOrEqual(window.innerHeight - 8);
  fireEvent.scroll(window);
  fireEvent.resize(window);
  expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
});

it.each([false, true])(
  "derives navigation from the current view and restores it without reloading history (all=%s)",
  async all => {
    const defaultOffset = all ? 0 : 5;
    let visible = { from: 0, to: 1 + defaultOffset };
    const changeRange = (range: { from: number; to: number }) => {
      visible = range;
      mockTimeScale.getVisibleLogicalRange.mockReturnValue(range);
      mockTimeScale.scrollPosition.mockReturnValue(range.to - 1);
      mockTimeScale.subscribeVisibleLogicalRangeChange.mock.calls[0]?.[0](range);
    };
    mockTimeScale.setVisibleLogicalRange.mockImplementation(changeRange);
    mockTimeScale.scrollToPosition.mockImplementation((offset: number) => {
      const to = 1 + offset;
      changeRange({ from: to - (visible.to - visible.from), to });
    });
    mockPriceScale.applyOptions.mockImplementation((options: { autoScale?: boolean }) => {
      if (options.autoScale !== undefined) mockPriceScale.options.mockReturnValue({ autoScale: options.autoScale });
    });
    const loadPage = jest.fn().mockResolvedValue(firstPage);
    render(<PriceCandleChart {...props} all={all} loadPage={loadPage} />);
    await waitFor(() => expect(mockCandles.setData).toHaveBeenCalledTimes(1));
    const initial = { ...visible };
    const reset = () => screen.queryByRole("button", { name: "Reset chart view" });
    const latest = () => screen.queryByRole("button", { name: "Scroll to the most recent bar" });
    await waitFor(() => expect(reset()).not.toBeInTheDocument());

    act(() => changeRange({ from: initial.from - 20, to: initial.to - 20 }));
    await waitFor(() => expect(latest()).toBeInTheDocument());
    expect(reset()).toBeInTheDocument();
    act(() => changeRange(initial));
    await waitFor(() => expect(reset()).not.toBeInTheDocument());
    expect(latest()).not.toBeInTheDocument();

    const zoomed = { from: initial.to - (initial.to - initial.from) / 2, to: initial.to };
    act(() => changeRange(zoomed));
    await waitFor(() => expect(reset()).toBeInTheDocument());
    expect(latest()).not.toBeInTheDocument();
    act(() => changeRange({ from: zoomed.from - 20, to: zoomed.to - 20 }));
    await waitFor(() => expect(latest()).toBeInTheDocument());
    fireEvent.click(latest()!);
    await waitFor(() => expect(latest()).not.toBeInTheDocument());
    expect(reset()).toBeInTheDocument();
    expect(visible).toEqual(zoomed);

    fireEvent.click(reset()!);
    await waitFor(() => expect(reset()).not.toBeInTheDocument());
    expect(visible).toEqual(initial);

    mockPriceScale.options.mockReturnValue({ autoScale: false });
    fireEvent.pointerUp(document);
    await waitFor(() => expect(reset()).toBeInTheDocument());
    expect(latest()).not.toBeInTheDocument();
    mockPriceScale.options.mockReturnValue({ autoScale: true });
    fireEvent.pointerUp(document);
    await waitFor(() => expect(reset()).not.toBeInTheDocument());

    mockPriceScale.options.mockReturnValue({ autoScale: false });
    fireEvent.pointerUp(document);
    await waitFor(() => expect(reset()).toBeInTheDocument());
    fireEvent.click(reset()!);
    await waitFor(() => expect(reset()).not.toBeInTheDocument());
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(loadPage).toHaveBeenCalledTimes(1);
    expect(mockCandles.setData).toHaveBeenCalledTimes(1);
    expect(mockRemove).not.toHaveBeenCalled();
  },
);

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

it.each([-0.07, 0])("retains nonpositive candle values and usable price increments (close=%s)", async close => {
  const bar = { ...firstPage[0], open: close, high: close + 0.001, low: close - 0.001, close };
  render(<PriceCandleChart {...props} loadPage={jest.fn().mockResolvedValue([bar])} />);
  await waitFor(() => expect(mockCandles.setData).toHaveBeenCalledTimes(1));
  expect(mockCandles.setData).toHaveBeenCalledWith([
    { time: bar.time, open: bar.open, high: bar.high, low: bar.low, close },
  ]);
  const { minMove } = mockCandles.applyOptions.mock.calls[0][0].priceFormat;
  expect(Number.isFinite(minMove)).toBe(true);
  expect(minMove).toBeGreaterThan(0);
});

it.each(["wick", "earlier candle"])(
  "preserves small axis prices with a zero latest close and a nonzero %s",
  async source => {
    const zero = { ...firstPage[0], open: 0, high: 0, low: 0, close: 0 };
    const small = { ...zero, open: 0.000001, high: 0.000002, low: 0, close: 0 };
    const page = source === "wick" ? [small] : [small, { ...zero, time: zero.time + 300 }];
    render(
      <PriceCandleChart
        {...props}
        formatCandlePrice={price => price.toFixed(2)}
        loadPage={jest.fn().mockResolvedValue(page)}
      />,
    );
    await waitFor(() => expect(mockCandles.setData).toHaveBeenCalledTimes(1));
    const axisFormat = mockCandles.applyOptions.mock.calls[0][0].priceFormat;
    expect(axisFormat.minMove).toBeLessThanOrEqual(0.000001);
    const labels = axisFormat.tickmarksFormatter([0, 0.000001, 0.000002]);
    expect(labels.map(Number)).toEqual([0, 0.000001, 0.000002]);
  },
);

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
      mockCandles.barsInLogicalRange.mockReturnValueOnce({ barsBefore: 10 });
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
  expect(loadPage).toHaveBeenNthCalledWith(3, 273300, 282300);

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
    mockCandles.barsInLogicalRange.mockReturnValueOnce({ barsBefore: 10 });
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
  const sparse = [{ ...firstPage[0], time: 264600 }];
  const earlier = [{ ...olderPage[0], time: 246600 }];
  const loadPage = jest
    .fn()
    .mockResolvedValueOnce([])
    .mockResolvedValueOnce([])
    .mockResolvedValueOnce(sparse)
    .mockResolvedValueOnce([])
    .mockResolvedValueOnce(earlier);
  const { container } = render(<PriceCandleChart {...props} loadPage={loadPage} />);
  await screen.findByRole("button", { name: "Search older history" });
  expect(loadPage).toHaveBeenNthCalledWith(1, 282300, 300300);
  expect(loadPage).toHaveBeenCalledTimes(1);

  fireEvent.click(screen.getByRole("button", { name: "Search older history" }));
  await waitFor(() => expect(loadPage).toHaveBeenCalledTimes(2));
  await screen.findByRole("button", { name: "Search older history" });
  fireEvent.click(screen.getByRole("button", { name: "Search older history" }));
  await waitFor(() => expect(mockCandles.setData).toHaveBeenCalledTimes(1));
  expect(loadPage).toHaveBeenNthCalledWith(2, 273300, 282300);
  expect(loadPage).toHaveBeenNthCalledWith(3, 264300, 273300);

  const panLeft = () => {
    act(() => {
      mockCandles.barsInLogicalRange.mockReturnValueOnce({ barsBefore: 10 });
      fireEvent.wheel(container.querySelector(".price-chart-canvas")!);
      mockTimeScale.subscribeVisibleLogicalRangeChange.mock.calls[0][0]({ from: 0, to: 10 });
    });
  };
  panLeft();
  await waitFor(() => expect(loadPage).toHaveBeenCalledTimes(4));
  expect(mockCandles.setData).toHaveBeenCalledTimes(1);
  expect(loadPage).toHaveBeenNthCalledWith(4, 255300, 264300);
  panLeft();
  await waitFor(() => expect(mockCandles.setData).toHaveBeenCalledTimes(2));
  expect(loadPage).toHaveBeenNthCalledWith(5, 246300, 255300);
});

it("caps initial and subsequent All daily requests at 30 days without looping through empty history", async () => {
  jest.spyOn(Date, "now").mockReturnValue(100 * 86400 * 1000);
  const loadPage = jest.fn().mockResolvedValue([]);
  render(<PriceCandleChart {...props} interval={86400} daily all loadPage={loadPage} />);
  await screen.findByRole("button", { name: "Search older history" });
  expect(loadPage).toHaveBeenCalledTimes(2);
  const [start, end] = loadPage.mock.calls[0];
  expect(end - start).toBe(30 * 86400);
  expect(start % 86400).toBe(0);
  expect(loadPage).toHaveBeenNthCalledWith(2, start - 30 * 86400, start);
  fireEvent.click(screen.getByRole("button", { name: "Search older history" }));
  await waitFor(() => expect(loadPage).toHaveBeenCalledTimes(3));
  expect(loadPage).toHaveBeenNthCalledWith(3, start - 60 * 86400, start - 30 * 86400);
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
      mockCandles.barsInLogicalRange.mockReturnValueOnce({ barsBefore: 10 });
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
    expect(mockCandles.update.mock.calls.map(([bar]) => bar)).toEqual([
      { time: 300000, open: 2, high: 5, low: 2, close: 4 },
      { time: 300300, open: 4, high: 6, low: 2, close: 6 },
    ]);
    expect(mockCandles.setData).toHaveBeenCalledTimes(1);
    expect(mockVolume.update.mock.calls.map(([bar]) => bar.value)).toEqual([8, 2]);

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
    expect(mockCandles.update).toHaveBeenLastCalledWith({ time: 300000, open: 2, high: 4, low: 2, close: 4 });
  } finally {
    unmount();
    jest.useRealTimers();
  }
});

it("formats negative token price-axis ticks with one minus sign", async () => {
  render(
    <PriceCandleChart
      {...props}
      formatCandlePrice={formatTokenCandlePrice}
      loadPage={jest.fn().mockResolvedValue(firstPage)}
    />,
  );
  await waitFor(() => expect(mockCandles.setData).toHaveBeenCalledTimes(1));
  const format = mockCandles.applyOptions.mock.calls[0][0].priceFormat.tickmarksFormatter;
  expect(format([-200, -0.5, 0, 0.5, 200])).toEqual(["-200", "-0.5", "0", "0.5", "200"]);
});

it.each([300, 3600, 14400])("keeps intraday ticks and crosshair times in UTC (interval=%s)", async interval => {
  jest.spyOn(Date, "now").mockReturnValue(Date.parse("2027-01-01T00:05:00Z"));
  const time = Date.parse("2027-01-01T00:00:00Z") / 1000;
  const bar = { ...firstPage[0], time };
  render(<PriceCandleChart {...props} interval={interval} loadPage={jest.fn().mockResolvedValue([bar])} />);
  await waitFor(() => expect(mockCandles.setData).toHaveBeenCalledTimes(1));
  const options = mockCreateChart.mock.calls[0][1];
  expect(options.timeScale.tickMarkFormatter(time, 0)).toBe("2027");
  expect(options.timeScale.tickMarkFormatter(time, 1)).toBe("Jan");
  expect(options.timeScale.tickMarkFormatter(time, 2)).toBe("Jan 1");
  expect(options.timeScale.tickMarkFormatter(time, 3)).toBe("00:00");
  expect(options.localization.timeFormatter(time)).toBe("Jan 1, 2027, 00:00");
});

it.each([false, true])("keeps UTC day, month, and year labels for daily candles (All=%s)", async all => {
  jest.spyOn(Date, "now").mockReturnValue(Date.parse("2027-01-02T12:00:00Z"));
  const time = Date.parse("2027-01-01T00:00:00Z") / 1000;
  const bar = { ...firstPage[0], time };
  const loadPage = jest.fn().mockResolvedValueOnce([bar]).mockResolvedValue([]);
  render(<PriceCandleChart {...props} interval={86400} daily all={all} loadPage={loadPage} />);
  await waitFor(() => expect(mockCandles.setData).toHaveBeenCalledTimes(1));
  const options = mockCreateChart.mock.calls[0][1];
  expect(options.timeScale.tickMarkFormatter(time, 0)).toBe("2027");
  expect(options.timeScale.tickMarkFormatter(time, 1)).toBe("Jan");
  expect(options.timeScale.tickMarkFormatter(time, 2)).toBe("Jan 1");
  expect(options.localization.timeFormatter(time)).toBe("Jan 1, 2027");
});

it("preserves candle positions, fractional zoom, and whitespace when older candles are prepended", async () => {
  const loadPage = jest.fn().mockResolvedValueOnce(firstPage).mockResolvedValueOnce(olderPage);
  const { container } = render(<PriceCandleChart {...props} loadPage={loadPage} />);
  await waitFor(() => expect(mockCandles.setData).toHaveBeenCalledTimes(1));
  act(() => {
    mockCandles.barsInLogicalRange.mockReturnValueOnce({ barsBefore: 10 });
    fireEvent.wheel(container.querySelector(".price-chart-canvas")!);
    mockTimeScale.subscribeVisibleLogicalRangeChange.mock.calls[0][0]({ from: -4.25, to: 9.75 });
  });
  await waitFor(() => expect(mockCandles.setData).toHaveBeenCalledTimes(2));
  expect(mockTimeScale.setVisibleLogicalRange).toHaveBeenLastCalledWith({ from: -3.25, to: 10.75 });
});

it("keeps a drag made during an in-flight refresh instead of following newly appended candles", async () => {
  jest.useFakeTimers();
  jest.setSystemTime(300000000);
  const bar = { ...firstPage[1], time: 300000 };
  const next = { ...bar, time: 300300, close: 4, high: 4 };
  let finish!: (bars: PriceBar[]) => void;
  const loadPage = jest
    .fn()
    .mockResolvedValueOnce([bar])
    .mockImplementationOnce(
      () =>
        new Promise<PriceBar[]>(resolve => {
          finish = resolve;
        }),
    );
  const { unmount } = render(<PriceCandleChart {...props} loadPage={loadPage} />);
  try {
    await act(async () => {});
    jest.setSystemTime(300300000);
    await act(async () => {
      jest.advanceTimersByTime(5_000);
    });
    mockTimeScale.getVisibleLogicalRange.mockReturnValue({ from: -12.5, to: -2.5 });
    await act(async () => {
      finish([bar, next]);
    });
    expect(mockCandles.update).toHaveBeenLastCalledWith({ time: 300300, open: 2, high: 4, low: 2, close: 4 });
    expect(mockTimeScale.setVisibleLogicalRange).toHaveBeenLastCalledWith({ from: -12.5, to: -2.5 });
  } finally {
    unmount();
    jest.useRealTimers();
  }
});

it("leaves zero-volume buckets empty without removing their price candles", async () => {
  const zero = { ...firstPage[0], volume: 0 };
  render(<PriceCandleChart {...props} loadPage={jest.fn().mockResolvedValue([zero, firstPage[1]])} />);
  await waitFor(() => expect(mockVolume.setData).toHaveBeenCalled());
  expect(mockVolume.setData).toHaveBeenLastCalledWith([
    { time: zero.time },
    expect.objectContaining({ time: firstPage[1].time, value: 4 }),
  ]);
  expect(mockCandles.setData).toHaveBeenLastCalledWith([
    { time: zero.time, open: 1, high: 2, low: 1, close: 2 },
    { time: firstPage[1].time, open: 2, high: 3, low: 2, close: 3 },
  ]);
});

it("does not lose an older-history request made while the latest candle is refreshing", async () => {
  jest.useFakeTimers();
  jest.setSystemTime(300000000);
  const pending = Promise.withResolvers<PriceBar[]>();
  const recent = { ...firstPage[1], time: 300000 };
  const loadPage = jest
    .fn()
    .mockResolvedValueOnce([recent])
    .mockReturnValueOnce(pending.promise)
    .mockResolvedValueOnce(olderPage);
  const { container, unmount } = render(<PriceCandleChart {...props} loadPage={loadPage} />);
  try {
    await act(async () => {});
    await act(async () => {
      jest.advanceTimersByTime(5_000);
    });
    act(() => {
      fireEvent.wheel(container.querySelector(".price-chart-canvas")!);
      mockCandles.barsInLogicalRange.mockReturnValueOnce({ barsBefore: 10 });
      mockTimeScale.subscribeVisibleLogicalRangeChange.mock.calls[0][0]({ from: 0, to: 10 });
    });
    expect(loadPage).toHaveBeenCalledTimes(2);
    await act(async () => {
      pending.resolve([recent]);
    });
    expect(loadPage).toHaveBeenNthCalledWith(3, 273300, 282300);
    expect(mockCandles.setData).toHaveBeenLastCalledWith([
      { time: olderPage[0].time, open: 1, high: 1, low: 1, close: 1 },
      { time: recent.time, open: 2, high: 3, low: 2, close: 3 },
    ]);
  } finally {
    unmount();
    jest.useRealTimers();
  }
});

it("clears a live volume bar when its refreshed volume becomes zero", async () => {
  jest.useFakeTimers();
  jest.setSystemTime(300000000);
  const recent = { ...firstPage[1], time: 300000 };
  const loadPage = jest
    .fn()
    .mockResolvedValueOnce([recent])
    .mockResolvedValueOnce([{ ...recent, volume: 0 }]);
  const { unmount } = render(<PriceCandleChart {...props} loadPage={loadPage} />);
  try {
    await act(async () => {});
    await act(async () => {
      jest.advanceTimersByTime(5_000);
    });
    expect(mockVolume.update).toHaveBeenLastCalledWith({ time: recent.time });
    expect(mockCandles.update).toHaveBeenLastCalledWith({ time: recent.time, open: 2, high: 3, low: 2, close: 3 });
  } finally {
    unmount();
    jest.useRealTimers();
  }
});

it("preloads daily candles before any drag and replenishes the offscreen buffer without moving the viewport", async () => {
  jest.spyOn(Date, "now").mockReturnValue(200 * 86400 * 1000);
  jest.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(900);
  let visible = { from: -120, to: 29 };
  mockTimeScale.getVisibleLogicalRange.mockImplementation(() => visible);
  mockTimeScale.setVisibleLogicalRange.mockImplementation(range => {
    window.requestAnimationFrame(() => {
      visible = range;
      mockTimeScale.subscribeVisibleLogicalRangeChange.mock.calls[0][0](range);
    });
  });
  mockCandles.barsInLogicalRange.mockImplementation(range => ({ barsBefore: range.from }));
  const loadPage = jest.fn(async (start: number, end: number) =>
    Array.from({ length: (end - start) / 86400 }, (_, index) => ({
      ...firstPage[0],
      time: start + index * 86400,
    })),
  );
  const { container, unmount } = render(<PriceCandleChart {...props} interval={86400} daily loadPage={loadPage} />);
  try {
    await waitFor(() => {
      expect(mockCandles.setData.mock.calls.at(-1)?.[0][0].time).toBe(141 * 86400);
      expect(visible).toEqual({ from: 30, to: 64 });
    });
    const rendered = mockCandles.setData.mock.calls.at(-1)![0];
    expect(rendered[visible.from].time).toBe(171 * 86400);
    expect(rendered).toHaveLength(60);
    await act(async () => {
      mockTimeScale.subscribeVisibleLogicalRangeChange.mock.calls[0][0](visible);
    });
    expect(loadPage).toHaveBeenCalledTimes(2);
    expect(loadPage.mock.calls.every(([start, end]) => end - start <= 30 * 86400)).toBe(true);
    act(() => {
      visible = { from: 20, to: 54 };
      fireEvent.wheel(container.querySelector(".price-chart-canvas")!);
      mockTimeScale.subscribeVisibleLogicalRangeChange.mock.calls[0][0](visible);
    });
    await waitFor(() => {
      expect(mockCandles.setData.mock.calls.at(-1)?.[0][0].time).toBe(111 * 86400);
      expect(visible).toEqual({ from: 50, to: 84 });
    });
    expect(mockCandles.setData.mock.calls.at(-1)![0][visible.from].time).toBe(161 * 86400);
  } finally {
    unmount();
    mockTimeScale.getVisibleLogicalRange.mockReset().mockReturnValue({ from: -4.25, to: 9.75 });
    mockTimeScale.setVisibleLogicalRange.mockReset();
    mockCandles.barsInLogicalRange.mockReset().mockReturnValue({ barsBefore: 10 });
  }
});

it.each(["empty", "error"])(
  "keeps the prepared chart usable when a buffer replenishment returns an %s page",
  async outcome => {
    jest.spyOn(Date, "now").mockReturnValue(200 * 86400 * 1000);
    let visible = { from: 0, to: 34 };
    mockTimeScale.getVisibleLogicalRange.mockImplementation(() => visible);
    mockTimeScale.setVisibleLogicalRange.mockImplementation(range => {
      visible = range;
      queueMicrotask(() => mockTimeScale.subscribeVisibleLogicalRangeChange.mock.calls[0][0](range));
    });
    mockCandles.barsInLogicalRange.mockImplementation(range => ({ barsBefore: range.from }));
    const initial = Array.from({ length: 30 }, (_, index) => ({ ...firstPage[0], time: (171 + index) * 86400 }));
    const buffer = Array.from({ length: 30 }, (_, index) => ({ ...firstPage[0], time: (141 + index) * 86400 }));
    const loadPage = jest
      .fn()
      .mockResolvedValueOnce(initial)
      .mockResolvedValueOnce(buffer)
      .mockImplementation(async () => {
        if (outcome === "error") throw new Error("offline");
        return [];
      });
    const { container, unmount } = render(<PriceCandleChart {...props} interval={86400} daily loadPage={loadPage} />);
    try {
      await waitFor(() => expect(mockCandles.setData).toHaveBeenCalledTimes(1));
      act(() => {
        visible = { from: 20, to: 54 };
        fireEvent.wheel(container.querySelector(".price-chart-canvas")!);
        mockTimeScale.subscribeVisibleLogicalRangeChange.mock.calls[0][0](visible);
      });
      await waitFor(() => expect(loadPage).toHaveBeenCalledTimes(3));
      await act(async () => {
        mockTimeScale.subscribeVisibleLogicalRangeChange.mock.calls[0][0](visible);
      });
      expect(loadPage).toHaveBeenCalledTimes(3);
      expect(screen.queryByRole("status", { name: props.loadingLabel })).not.toBeInTheDocument();
      expect(mockCandles.setData.mock.calls.at(-1)![0][0].time).toBe(141 * 86400);
    } finally {
      unmount();
      mockTimeScale.getVisibleLogicalRange.mockReset().mockReturnValue({ from: -4.25, to: 9.75 });
      mockTimeScale.setVisibleLogicalRange.mockReset();
    }
  },
);

it("does not expose an interactive daily chart until its initial history buffer has arrived", async () => {
  jest.spyOn(Date, "now").mockReturnValue(200 * 86400 * 1000);
  mockCandles.barsInLogicalRange.mockReturnValue({ barsBefore: 0 });
  const latest = Array.from({ length: 30 }, (_, index) => ({ ...firstPage[0], time: (171 + index) * 86400 }));
  const older = Array.from({ length: 30 }, (_, index) => ({ ...firstPage[0], time: (141 + index) * 86400 }));
  const pending = Promise.withResolvers<PriceBar[]>();
  const loadPage = jest.fn().mockResolvedValueOnce(latest).mockReturnValueOnce(pending.promise);
  const { unmount } = render(<PriceCandleChart {...props} interval={86400} daily loadPage={loadPage} />);
  try {
    await waitFor(() => expect(loadPage).toHaveBeenCalledTimes(2));
    expect(screen.getByRole("status", { name: props.loadingLabel })).toBeInTheDocument();
    expect(mockCandles.setData).not.toHaveBeenCalled();
    await act(async () => {
      pending.resolve(older);
    });
    await waitFor(() => expect(screen.queryByRole("status", { name: props.loadingLabel })).not.toBeInTheDocument());
    const rendered = mockCandles.setData.mock.calls.at(-1)![0];
    expect(rendered).toHaveLength(60);
    expect(rendered[0].time).toBe(141 * 86400);
    expect(rendered[30].time).toBe(171 * 86400);
    expect(mockTimeScale.setVisibleLogicalRange).toHaveBeenLastCalledWith({ from: 30, to: 64 });
  } finally {
    unmount();
  }
});
