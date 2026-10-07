import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";

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
const mockCreateChart = jest.fn().mockImplementation(() => ({
  addSeries: jest.fn().mockReturnValueOnce(mockCandles).mockReturnValueOnce(mockVolume),
  priceScale: () => ({ applyOptions: jest.fn() }),
  timeScale: () => mockTimeScale,
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
jest.mock(
  "lightweight-charts",
  () => ({
    CandlestickSeries: "candles",
    HistogramSeries: "volume",
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
  volumeLabel: "Volume (GNOT)",
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
  mockTimeScale.getVisibleRange.mockReturnValue({ from: 100, to: 200 });
  jest.spyOn(Date, "now").mockReturnValue(300000000);
});
afterEach(() => {
  jest.restoreAllMocks();
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
  expect(screen.getByText("Volume (GNOT)")).toBeInTheDocument();

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
