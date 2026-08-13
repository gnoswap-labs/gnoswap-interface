import { render, screen } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";

import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";

import SwapTokenHeader from "./SwapTokenHeader";

jest.mock("@hooks/common/use-element-width", () => ({
  __esModule: true,
  default: () => 0,
}));

jest.mock("@hooks/common/use-custom-router", () => ({
  __esModule: true,
  default: () => ({
    movePageWithTokenPath: jest.fn(),
  }),
}));

jest.mock("@hooks/common/use-gnoscan-url", () => ({
  __esModule: true,
  useGnoscanUrl: () => ({
    getGnoscanUrl: () => "",
    getTokenUrl: () => "",
  }),
}));

describe("SwapTokenHeader", () => {
  it("truncates long token names in the swap header", async () => {
    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <SwapTokenHeader
            tokenInfo={{
              name: "FOOTBALL WORLD CUB",
              symbol: "FWC",
              displaySymbol: "FWC",
              logoURI: "",
              path: "gno.land/r/football/world",
              isNative: false,
            }}
            priceGradeType="NONE"
            currentPrice="$1.00"
            containerWidth={600}
          />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );

    expect(await screen.findByText("FOOTBALL...")).toBeInTheDocument();
    expect(screen.queryByText("FOOTBALL WORLD CUB")).not.toBeInTheDocument();
  });
});
