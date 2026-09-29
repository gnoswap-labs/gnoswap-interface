import { render, screen } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";

import { TokenModel } from "@models/token/token-model";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { swapExtensions } from "@resources/swap-extension";

import SwapTokenInfo from "./SwapTokenInfo";

jest.mock("@hooks/common/use-element-width", () => ({
  __esModule: true,
  default: () => 600,
}));

jest.mock("@hooks/common/use-custom-router", () => ({
  __esModule: true,
  default: () => ({ movePageWithTokenPath: jest.fn() }),
}));

jest.mock("@hooks/common/use-gnoscan-url", () => ({
  useGnoscanUrl: () => ({
    getGnoscanUrl: () => "https://gnoscan.io/",
    getRealmUrl: (path: string) => `https://gnoscan.io/realms/details?path=${path}`,
    getTokenUrl: (path: string) => `https://gnoscan.io/tokens/${path}`,
  }),
}));

jest.mock("@query/token", () => ({
  useGetTokenPrices: () => ({
    data: { usd: "0.19", priceGradeType: "NONE", last7d: [] },
    isLoading: false,
    isFetched: true,
  }),
}));

jest.mock("./SwapTokenChart", () => ({
  __esModule: true,
  default: () => null,
}));

describe("SwapTokenInfo", () => {
  it("shows the realm path for a native swap extension", () => {
    const extension = swapExtensions[0];
    const token = {
      path: extension.originTokenPath,
      wrappedPath: extension.grc20WrappedTokenPath,
      type: "Native",
      chainId: "portal-loop",
      name: "Bubble",
      symbol: "BUBBLE",
      displaySymbol: "BUBBLE",
      decimals: 6,
      logoURI: "",
      createdAt: "",
      priceID: extension.grc20WrappedTokenPath,
    } satisfies TokenModel;

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <SwapTokenInfo token={token} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );

    expect(screen.getByRole("button", { name: "BUBBLE" })).toBeInTheDocument();
    expect(screen.getByText(extension.originTokenPath.replace(/^gno\.land\//, ""))).toBeInTheDocument();
    expect(screen.queryByText("Native Coin")).not.toBeInTheDocument();
  });
});
