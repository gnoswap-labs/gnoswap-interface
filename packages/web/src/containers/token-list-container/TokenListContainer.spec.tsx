import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { TokenModel } from "@models/token/token-model";

import TokenListContainer from "./TokenListContainer";

jest.mock("next-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock("@hooks/token/data/use-token-data", () => ({
  useTokenData: jest.fn(),
}));

jest.mock("@hooks/token/data/use-gnot-wugnot", () => ({
  useGnotToGnot: () => ({
    wugnotPath: "gno.land/r/demo/wugnot",
    getGnotPath: (token: unknown) => token ?? {},
  }),
}));

jest.mock("@hooks/common/use-loading", () => ({
  useLoading: () => ({ isLoadingTokens: false }),
}));

jest.mock("@hooks/common/use-window-size", () => ({
  useWindowSize: () => ({
    breakpoint: "web",
    handleBreakpoint: jest.fn(),
    width: 1440,
    isMobile: false,
    isWeb: true,
    isTablet: false,
  }),
}));

jest.mock("@hooks/common/use-click-outside", () => ({
  __esModule: true,
  default: () => [{ current: null }, false, jest.fn()],
}));

jest.mock("@components/home/token-info/TokenInfo", () => ({
  __esModule: true,
  default: ({ item }: { item: { token: { name: string; symbol: string } } }) => (
    <div data-testid="token-row">
      {item.token.name} ({item.token.symbol})
    </div>
  ),
}));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { useTokenData } = require("@hooks/token/data/use-token-data");

const makeToken = (overrides: Partial<TokenModel>): TokenModel => ({
  path: "gno.land/r/demo/token",
  type: "GRC20",
  chainId: "dev",
  name: "Token",
  symbol: "TKN",
  displaySymbol: "TKN",
  decimals: 6,
  logoURI: "",
  createdAt: "2024-01-01T00:00:00Z",
  priceID: "gno.land/r/demo/token",
  ...overrides,
});

const verifiedToken = makeToken({
  path: "gno.land/r/demo/verified",
  name: "VerifiedToken",
  symbol: "VER",
  priceID: "gno.land/r/demo/verified",
  isVerified: true,
});

const unverifiedToken = makeToken({
  path: "gno.land/r/demo/unverified",
  name: "UnverifiedToken",
  symbol: "UNV",
  priceID: "gno.land/r/demo/unverified",
  isVerified: false,
});

const renderContainer = () =>
  render(
    <GnoswapThemeProvider>
      <TokenListContainer />
    </GnoswapThemeProvider>,
  );

describe("TokenListContainer unverified token filtering", () => {
  beforeEach(() => {
    useTokenData.mockImplementation((showUnverified: boolean) => ({
      tokens: showUnverified ? [verifiedToken, unverifiedToken] : [verifiedToken],
      tokenPrices: {},
      error: null,
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const getToggle = () => screen.getByLabelText("Main:tokenList.showUnverifiedTokens");
  const getRenderedTokenRows = () => screen.queryAllByTestId("token-row").map(row => row.textContent ?? "");

  it("renders the toggle in OFF state by default", () => {
    renderContainer();

    const toggle = getToggle();
    expect(toggle).not.toBeChecked();
    expect(useTokenData).toHaveBeenLastCalledWith(false);
  });

  it("hides unverified tokens by default and shows verified tokens", () => {
    renderContainer();

    const rows = getRenderedTokenRows();
    expect(rows.some(row => row.includes("VerifiedToken"))).toBe(true);
    expect(rows.some(row => row.includes("UnverifiedToken"))).toBe(false);
  });

  it("shows all tokens when the toggle is switched on", () => {
    renderContainer();

    fireEvent.click(getToggle());

    const rows = getRenderedTokenRows();
    expect(useTokenData).toHaveBeenLastCalledWith(true);
    expect(rows.some(row => row.includes("VerifiedToken"))).toBe(true);
    expect(rows.some(row => row.includes("UnverifiedToken"))).toBe(true);
  });

  it("hides unverified tokens again when the toggle is switched back off", () => {
    renderContainer();

    fireEvent.click(getToggle());
    fireEvent.click(getToggle());

    const rows = getRenderedTokenRows();
    expect(rows.some(row => row.includes("VerifiedToken"))).toBe(true);
    expect(rows.some(row => row.includes("UnverifiedToken"))).toBe(false);
  });
});
