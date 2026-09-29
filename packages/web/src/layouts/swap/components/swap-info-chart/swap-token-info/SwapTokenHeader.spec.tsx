import { fireEvent, render, screen } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";

import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { swapExtensions } from "@resources/swap-extension";

import SwapTokenHeader from "./SwapTokenHeader";
const mockMovePageWithTokenPath = jest.fn();
const mockGetRealmUrl = jest.fn((path: string) => `https://gnoscan.io/realms/details?path=${path}`);


jest.mock("@hooks/common/use-element-width", () => ({
  __esModule: true,
  default: () => 0,
}));

jest.mock("@hooks/common/use-custom-router", () => ({
  __esModule: true,
  default: () => ({
    movePageWithTokenPath: mockMovePageWithTokenPath,
  }),
}));

jest.mock("@hooks/common/use-gnoscan-url", () => ({
  __esModule: true,
  useGnoscanUrl: () => ({
    getGnoscanUrl: () => "https://gnoscan.io/",
    getRealmUrl: mockGetRealmUrl,
    getTokenUrl: (path: string) => `https://gnoscan.io/tokens/${path}`,
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

  it("shows the Bubble realm path and opens its realm explorer", () => {
    const extension = swapExtensions[0];
    const open = jest.spyOn(window, "open").mockImplementation();

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <SwapTokenHeader
            tokenInfo={{
              name: "Bubble",
              symbol: "BUBBLE",
              displaySymbol: "BUBBLE",
              logoURI: "",
              path: extension.originTokenPath,
              isNative: true,
            }}
            priceGradeType="NONE"
            currentPrice="$0.189"
            containerWidth={600}
          />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );

    expect(screen.getByRole("button", { name: "BUBBLE" })).toBeInTheDocument();
    expect(screen.getByText(extension.originTokenPath.replace(/^gno\.land\//, ""))).toBeInTheDocument();

    fireEvent.click(screen.getByText(extension.originTokenPath.replace(/^gno\.land\//, "")).closest("button")!);
    expect(mockGetRealmUrl).toHaveBeenCalledWith(extension.originTokenPath);
    expect(open).toHaveBeenCalledWith(
      `https://gnoscan.io/realms/details?path=${extension.originTokenPath}`,
      "_blank",
      "noopener,noreferrer",
    );

    fireEvent.click(screen.getByRole("button", { name: "BUBBLE" }));
    expect(mockMovePageWithTokenPath).toHaveBeenCalledWith("TOKEN", extension.grc20WrappedTokenPath);
  });
});
