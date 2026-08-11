import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import { GNOT_TOKEN_DEFAULT, GNS_TOKEN, WUGNOT_TOKEN } from "@common/values/token-constant";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { TokenModel } from "@models/token/token-model";

import AssetListContainer from "./AssetListContainer";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock("@adena-wallet/sdk", () => ({
  makeMsgCallMessage: jest.fn(),
  makeMsgSendMessage: jest.fn(),
  TransactionBuilder: jest.fn(),
}));

jest.mock("@query/token", () => ({
  useGetTokens: jest.fn(),
}));

jest.mock("@query/address", () => ({
  useGetAvgBlockTime: () => ({ data: { AvgBlockTime: 2.2 } }),
}));

jest.mock("@hooks/token/data/use-token-data", () => ({
  useTokenData: jest.fn(),
}));

jest.mock("@hooks/wallet/data/use-wallet", () => ({
  useWallet: () => ({
    connected: true,
    account: { address: "g1tester" },
    isSwitchNetwork: false,
  }),
}));

jest.mock("@hooks/pool/data/use-position-data", () => ({
  usePositionData: () => ({ loading: false }),
}));

jest.mock("@hooks/wallet/data/useSendAsset", () => ({
  __esModule: true,
  default: () => ({ isConfirm: false, setIsConfirm: jest.fn(), onSubmit: jest.fn() }),
}));

jest.mock("@hooks/common/use-custom-router", () => ({
  __esModule: true,
  default: () => ({ movePageWithTokenPath: jest.fn() }),
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

jest.mock("@hooks/common/use-prevent-scroll", () => ({
  usePreventScroll: jest.fn(),
}));

jest.mock("@layouts/portfolio/components/asset-list/asset-list-table/asset-info/AssetInfo", () => ({
  __esModule: true,
  default: ({ asset }: { asset: { name: string; symbol: string } }) => (
    <div data-testid="asset-row">
      {asset.name} ({asset.symbol})
    </div>
  ),
}));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { useGetTokens } = require("@query/token");
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

const verifiedWithBalance = makeToken({
  path: "gno.land/r/demo/verified-balance",
  name: "VerifiedBal",
  symbol: "VBAL",
  priceID: "gno.land/r/demo/verified-balance",
  isVerified: true,
});

const verifiedZero = makeToken({
  path: "gno.land/r/demo/verified-zero",
  name: "VerifiedZero",
  symbol: "VZERO",
  priceID: "gno.land/r/demo/verified-zero",
  isVerified: true,
});

const unverifiedWithBalance = makeToken({
  path: "gno.land/r/demo/unverified-balance",
  name: "UnverifiedBal",
  symbol: "UBAL",
  priceID: "gno.land/r/demo/unverified-balance",
  isVerified: false,
});

const unverifiedZero = makeToken({
  path: "gno.land/r/demo/unverified-zero",
  name: "UnverifiedZero",
  symbol: "UZERO",
  priceID: "gno.land/r/demo/unverified-zero",
  isVerified: false,
});

const ALL_TEST_TOKENS = [verifiedWithBalance, verifiedZero, unverifiedWithBalance, unverifiedZero];

// Positive balances through displayBalanceMap; zero-balance tokens have no entry, rendering "-"
const displayBalanceMap: Record<string, number> = {
  [verifiedWithBalance.path]: 100,
  [unverifiedWithBalance.path]: 50,
};

const renderContainer = () =>
  render(
    <GnoswapThemeProvider>
      <AssetListContainer />
    </GnoswapThemeProvider>,
  );

const setTokens = (tokens: TokenModel[]) => {
  useGetTokens.mockImplementation((showUnverified: boolean) => ({
    data: { tokens: showUnverified ? tokens : tokens.filter(token => token.isVerified) },
  }));
};

const setBalanceMap = () => {
  useTokenData.mockImplementation((showUnverified: boolean) => {
    void showUnverified;
    return {
      displayBalanceMap,
      balances: { ugnot: 1 },
      tokenPrices: {},
      isFetched: true,
      updateBalances: jest.fn(),
    };
  });
};

const openFilters = () => fireEvent.mouseEnter(screen.getByRole("button", { name: "Wallet:assets.filters" }));
const getShowUnverifiedToggle = () => screen.getByLabelText("Wallet:assets.showUnverifiedTokens");
const getHideZeroToggle = () => screen.getByLabelText("Wallet:assets.hideZeroAmt");
const getVisibleRows = () => screen.getAllByTestId("asset-row").map(row => row.textContent);

describe("AssetListContainer unverified token filtering", () => {
  beforeEach(() => {
    setTokens(ALL_TEST_TOKENS);
    setBalanceMap();
  });

  afterEach(() => {
    jest.clearAllMocks();
    GNOT_TOKEN_DEFAULT.isVerified = true;
    WUGNOT_TOKEN.isVerified = true;
    GNS_TOKEN.isVerified = true;
  });

  it("renders the toggle in OFF state by default and hides unverified assets", () => {
    renderContainer();

    openFilters();
    expect(getShowUnverifiedToggle()).not.toBeChecked();
    expect(useGetTokens).toHaveBeenLastCalledWith(false);
    expect(useTokenData).toHaveBeenLastCalledWith(false);
    expect(screen.getByText(/VerifiedBal/)).toBeInTheDocument();
    expect(screen.queryByText(/UnverifiedBal/)).not.toBeInTheDocument();
  });

  it("shows unverified assets when the toggle is switched on", () => {
    renderContainer();

    openFilters();
    fireEvent.click(getShowUnverifiedToggle());

    expect(useGetTokens).toHaveBeenLastCalledWith(true);
    expect(useTokenData).toHaveBeenLastCalledWith(true);
    expect(screen.getByText(/VerifiedBal/)).toBeInTheDocument();
    expect(screen.getByText(/UnverifiedBal/)).toBeInTheDocument();
    expect(screen.getByText(/VerifiedZero/)).toBeInTheDocument();
    expect(screen.getByText(/UnverifiedZero/)).toBeInTheDocument();
  });

  it.each([
    { hideZero: false, showUnverified: false, visible: ["VerifiedBal", "VerifiedZero"] },
    { hideZero: true, showUnverified: false, visible: ["VerifiedBal"] },
    {
      hideZero: false,
      showUnverified: true,
      visible: ["VerifiedBal", "VerifiedZero", "UnverifiedBal", "UnverifiedZero"],
    },
    { hideZero: true, showUnverified: true, visible: ["VerifiedBal", "UnverifiedBal"] },
  ])(
    "combines hide-zero ($hideZero) and show-unverified ($showUnverified) independently",
    ({ hideZero, showUnverified, visible }) => {
      renderContainer();

      openFilters();
      if (hideZero) fireEvent.click(getHideZeroToggle());
      if (showUnverified) fireEvent.click(getShowUnverifiedToggle());

      const rows = getVisibleRows();
      for (const name of ["VerifiedBal", "VerifiedZero", "UnverifiedBal", "UnverifiedZero"]) {
        const shouldShow = visible.includes(name);
        expect(rows.some(row => row?.includes(name))).toBe(shouldShow);
      }
    },
  );

  it("keeps zero-balance, type, and search filters working with the toggle on", () => {
    renderContainer();

    openFilters();
    fireEvent.click(getShowUnverifiedToggle());
    fireEvent.click(getHideZeroToggle());

    // search filter stays independent: only the unverified token with balance matches
    const searchInput = screen.getByRole("textbox");
    fireEvent.change(searchInput, { target: { value: "ubal" } });

    const rows = getVisibleRows();
    expect(rows.some(row => row?.includes("UnverifiedBal"))).toBe(true);
    expect(rows.some(row => row?.includes("VerifiedBal"))).toBe(false);
  });

  describe("fixed core-token fallback entries", () => {
    it("shows core tokens from fixed fallbacks by default because they are verified", () => {
      setTokens([]);
      renderContainer();

      const rows = getVisibleRows();
      expect(rows.some(row => row?.includes(GNOT_TOKEN_DEFAULT.name))).toBe(true);
      expect(rows.some(row => row?.includes(WUGNOT_TOKEN.name))).toBe(true);
      expect(rows.some(row => row?.includes(GNS_TOKEN.name))).toBe(true);
    });

    it("routes fixed fallback entries through the same verification filter", () => {
      setTokens([]);
      GNOT_TOKEN_DEFAULT.isVerified = false;
      WUGNOT_TOKEN.isVerified = false;
      GNS_TOKEN.isVerified = false;

      renderContainer();

      // unverified fallback entries are hidden by default
      expect(screen.queryAllByTestId("asset-row")).toHaveLength(0);

      openFilters();
      fireEvent.click(getShowUnverifiedToggle());

      const rows = getVisibleRows();
      expect(rows.some(row => row?.includes(GNOT_TOKEN_DEFAULT.name))).toBe(true);
      expect(rows.some(row => row?.includes(WUGNOT_TOKEN.name))).toBe(true);
      expect(rows.some(row => row?.includes(GNS_TOKEN.name))).toBe(true);
    });
  });
});
