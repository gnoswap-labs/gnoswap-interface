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
  { time: 100, open: 1, high: 2, low: 1, close: 2, volume: 3 },
  { time: 200, open: 2, high: 3, low: 2, close: 3, volume: 4 },
];
const olderPage: PriceBar[] = [{ time: 50, open: 1, high: 1, low: 1, close: 1, volume: 2 }];
const props = {
  identity: "pool",
  daily: false,
  label: "Price chart",
  volumeLabel: "Volume (USD)",
  loadingLabel: "Loading price history",
  emptyLabel: "No price history",
  errorLabel: "Could not load price history",
  retryLabel: "Retry",
  loadingOlderLabel: "Loading older history",
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
  expect(loadPage).toHaveBeenNthCalledWith(3, 100);
  expect(mockTimeScale.setVisibleRange).toHaveBeenCalledWith({ from: 100, to: 200 });
  expect(screen.queryByText("Could not load price history")).not.toBeInTheDocument();
  expect(mockCreateChart).toHaveBeenCalledTimes(1);
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
