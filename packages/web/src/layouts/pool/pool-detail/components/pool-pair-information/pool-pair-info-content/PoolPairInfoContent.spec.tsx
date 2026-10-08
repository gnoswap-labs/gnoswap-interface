import { fireEvent, render, screen } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";

import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { PoolRepositoryMock } from "@repositories/pool";

import PoolPairInfoContent from "./PoolPairInfoContent";

jest.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key: string) => key }) }));
jest.mock("@hooks/common/use-custom-router", () => ({
  __esModule: true,
  default: () => ({ getPoolPath: () => "pool" }),
}));
jest.mock("@hooks/common/use-gnoswap-context", () => ({
  useGnoswapContext: () => ({ gnoswapApiClient: null }),
}));
jest.mock("@hooks/common/use-window-size", () => ({
  useWindowSize: () => ({ width: 1200, isMobile: false, breakpoint: "web", handleBreakpoint: jest.fn() }),
}));
jest.mock("@hooks/token/data/use-gnot-wugnot", () => ({
  useGnotToGnot: () => ({ getGnotPath: (token: unknown) => token }),
}));
jest.mock("@hooks/token/data/use-token-price-info", () => ({
  useTokenPriceInfo: () => ({ priceStyle: { className: "" }, shouldShowPriceWarning: false }),
}));
jest.mock("@components/common/pool-graph/PoolGraph", () => ({ __esModule: true, default: () => null }));

it("visibly disables only the zoom control at each liquidity scale boundary", async () => {
  const pool = await new PoolRepositoryMock().getPoolDetailByPoolPath();
  const onZoomIn = jest.fn();
  const onZoomOut = jest.fn();
  const props = {
    pool,
    loading: true,
    loadingBins: false,
    liquiditySegments: [],
    onZoomIn,
    onZoomOut,
  };
  const view = (availZoomIn: boolean, availZoomOut: boolean) => (
    <JotaiProvider>
      <GnoswapThemeProvider>
        <PoolPairInfoContent {...props} availInfo={{ availZoomIn, availZoomOut }} />
      </GnoswapThemeProvider>
    </JotaiProvider>
  );
  const { rerender } = render(view(true, false));
  fireEvent.click(screen.getByRole("button", { name: "Pool:chart.liquidity" }));

  const zoomOut = screen.getByRole("button", { name: "Zoom out" }) as HTMLButtonElement;
  const zoomIn = screen.getByRole("button", { name: "Zoom in" }) as HTMLButtonElement;
  expect(zoomOut.disabled).toBe(true);
  expect(zoomOut.classList.contains("disabled")).toBe(true);
  expect(zoomIn.disabled).toBe(false);
  fireEvent.click(zoomOut);
  fireEvent.click(zoomIn);
  expect(onZoomOut).not.toHaveBeenCalled();
  expect(onZoomIn).toHaveBeenCalledTimes(1);

  rerender(view(false, true));
  expect(zoomIn.disabled).toBe(true);
  expect(zoomIn.classList.contains("disabled")).toBe(true);
  expect(zoomOut.disabled).toBe(false);
  fireEvent.click(zoomIn);
  fireEvent.click(zoomOut);
  expect(onZoomIn).toHaveBeenCalledTimes(1);
  expect(onZoomOut).toHaveBeenCalledTimes(1);
});
