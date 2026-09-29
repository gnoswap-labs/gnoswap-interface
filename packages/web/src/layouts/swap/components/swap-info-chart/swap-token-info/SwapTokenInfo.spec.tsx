import { render, screen } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";

import { TokenModel } from "@models/token/token-model";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { createOriginToken, swapExtensions } from "@resources/swap-extension";

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

const mockUseGetTokenPrices = jest.fn((_path: string) => ({
  data: { usd: "0.19", priceGradeType: "NONE", last7d: [] },
  isLoading: false,
  isFetched: true,
}));

jest.mock("@query/token", () => ({
  useGetTokenPrices: (path: string) => mockUseGetTokenPrices(path),
}));

jest.mock("./SwapTokenChart", () => ({
  __esModule: true,
  default: () => null,
}));

describe("SwapTokenInfo", () => {
  const extension = swapExtensions[0];
  const wrappedToken = {
    type: "GRC20",
    chainId: "portal-loop",
    createdAt: "",
    name: "Bubble",
    path: extension.grc20WrappedTokenPath,
    decimals: 6,
    symbol: "BUBBLE",
    displaySymbol: "wBUBBLE",
    logoURI: "",
    priceID: extension.grc20WrappedTokenPath,
  } satisfies TokenModel;
  const originToken = createOriginToken(extension, wrappedToken);

  const renderToken = (token: TokenModel) =>
    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <SwapTokenInfo token={token} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );

  beforeEach(() => mockUseGetTokenPrices.mockClear());

  it("shows the realm path for a swap extension origin token", () => {
    renderToken(originToken);

    expect(screen.getByRole("button", { name: "BUBBLE" })).toBeInTheDocument();
    expect(screen.getByText(extension.originTokenPath.replace(/^gno\.land\//, ""))).toBeInTheDocument();
    expect(screen.queryByText("Native Coin")).not.toBeInTheDocument();
  });

  it("prices an origin token through its wrapped token", () => {
    renderToken(originToken);

    expect(mockUseGetTokenPrices).toHaveBeenCalledWith(extension.grc20WrappedTokenPath);
    expect(mockUseGetTokenPrices).not.toHaveBeenCalledWith(extension.originTokenPath);
  });

  it("prices a plain GRC20 token through its own path", () => {
    renderToken(wrappedToken);

    expect(mockUseGetTokenPrices).toHaveBeenCalledWith(extension.grc20WrappedTokenPath);
  });
});
