import { PriceImpactStatus, SwapRateAction } from "@hooks/swap/data/use-swap-handler";
import { SwapSummaryInfo } from "@models/swap/swap-summary-info";
import { SwapTokenInfo } from "@models/swap/swap-token-info";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import SwapCardFeeInfo from "./SwapCardFeeInfo";
import { formatRouterFeeStr } from "@utils/swap-utils";

// Mock @adena-wallet/sdk
jest.mock("@adena-wallet/sdk", () => ({
  makeMsgCallMessage: jest.fn(),
  makeMsgSendMessage: jest.fn(),
  TransactionBuilder: jest.fn(),
}));

const swapSummaryInfo: SwapSummaryInfo = {
  tokenA: {
    type: "GRC20",
    chainId: "dev.gnoswap",
    createdAt: "2023-12-08T03:57:43Z",
    name: "Foo",
    path: "gno.land/r/foo",
    decimals: 4,
    symbol: "FOO",
    displaySymbol: "FOO",
    logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_foo.svg",
    priceID: "gno.land/r/foo",
    address: "",
  },
  tokenB: {
    type: "GRC20",
    chainId: "dev.gnoswap",
    createdAt: "2023-12-08T03:57:43Z",
    name: "Foo",
    path: "gno.land/r/foo",
    decimals: 4,
    symbol: "FOO",
    displaySymbol: "FOO",
    logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_foo.svg",
    priceID: "gno.land/r/foo",
    address: "",
  },
  swapDirection: "EXACT_IN",
  swapRate: 1.14,
  swapRateUSD: 1.14,
  priceImpact: 0.3,
  guaranteedAmount: {
    amount: 45124,
    currency: "GNOT",
  },
  gasFee: {
    amount: 0.000001,
    currency: "GNOT",
  },
  gasFeeUSD: 0.1,
  swapRate1USD: 0,
  swapRateAction: SwapRateAction.ATOB,
  protocolFee: "",
  routerFee: 0.15,
  gasEstimateSuccess: false,
};

const swapTokenInfo: SwapTokenInfo = {
  tokenA: {
    token: {
      chainId: "dev",
      createdAt: "2023-10-17T05:58:00+09:00",
      name: "Foo",
      address: "g1evezrh92xaucffmtgsaa3rvmz5s8kedffsg469",
      path: "gno.land/r/foo",
      decimals: 4,
      symbol: "FOO",
      displaySymbol: "FOO",
      logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_foo.svg",
      type: "GRC20",
      priceID: "gno.land/r/foo",
    },
    amount: "0",
    balance: "0",
    usd: 0,
    usdStr: "0",
    priceGrade: "NONE",
    decimals: 4,
  },
  tokenB: {
    token: {
      chainId: "dev",
      createdAt: "2023-10-17T05:58:00+09:00",
      name: "Foo",
      address: "g1evezrh92xaucffmtgsaa3rvmz5s8kedffsg469",
      path: "gno.land/r/foo",
      decimals: 4,
      symbol: "FOO",
      displaySymbol: "FOO",
      logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_foo.svg",
      type: "GRC20",
      priceID: "gno.land/r/foo",
    },
    amount: "0",
    balance: "0",
    usd: 0,
    usdStr: "0",
    priceGrade: "NONE",
    decimals: 4,
  },
  direction: "EXACT_IN",
  slippage: 0,
};

describe("SwapCardFeeInfo Component", () => {
  it("SwapCardFeeInfo render", () => {
    const mockProps = {
      openedRouteInfo: false,
      toggleRouteInfo: () => null,
      swapSummaryInfo,
      swapTokenInfo,
      isLoading: false,
      priceImpactStatus: "HIGH" as PriceImpactStatus,
      isLoadingGasInfo: false,
      connectedWallet: false,
      gasEstimateSuccess: false,
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <SwapCardFeeInfo {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});

describe("formatRouterFeeStr", () => {
  it("falls back to the protocol fee when the output side is absent", () => {
    expect(formatRouterFeeStr(swapSummaryInfo, { ...swapTokenInfo, tokenB: null })).toBe(swapSummaryInfo.protocolFee);
    expect(formatRouterFeeStr(swapSummaryInfo, null)).toBe("-");
  });

  it.each([
    [100, "100", 4, "$0.15"],
    [1, "100", 4, "<$0.01"],
    [0, "100", 4, "0.15 FOO"],
    [0, "1000", 0, "1.5 FOO"],
    [0, "", 4, swapSummaryInfo.protocolFee],
  ])("formats usd=%s amount=%s decimals=%s", (usd, amount, decimals, expected) => {
    const tokenB = swapTokenInfo.tokenB;
    if (!tokenB) throw new Error("Expected a selected output token in the fixture");
    expect(
      formatRouterFeeStr(swapSummaryInfo, {
        ...swapTokenInfo,
        tokenB: { ...tokenB, usd, amount, decimals },
      }),
    ).toBe(expected);
  });
});
