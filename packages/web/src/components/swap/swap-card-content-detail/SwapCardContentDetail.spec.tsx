import { fireEvent, render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";

import { SwapRateAction } from "@hooks/swap/data/use-swap-handler";

import { SwapSummaryInfo } from "@models/swap/swap-summary-info";
import { SwapTokenInfo } from "@models/swap/swap-token-info";
import { TokenModel } from "@models/token/token-model";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";

import SwapCardContentDetail, { SwapCardContentDetailProps } from "./SwapCardContentDetail";

// Mock @adena-wallet/sdk
jest.mock("@adena-wallet/sdk", () => ({
  makeMsgCallMessage: jest.fn(),
  makeMsgSendMessage: jest.fn(),
  TransactionBuilder: jest.fn(),
}));

const tokenA: TokenModel = {
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
};

const tokenB: TokenModel = {
  ...tokenA,
  name: "Bar",
  path: "gno.land/r/bar",
  decimals: 6,
  symbol: "BAR",
  displaySymbol: "BAR",
  logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_bar.svg",
  priceID: "gno.land/r/bar",
};

const swapSummaryInfo: SwapSummaryInfo = {
  tokenA: tokenA,
  tokenB: tokenB,
  swapDirection: "EXACT_IN",
  swapRate: 1.14,
  swapRateUSD: 1.14,
  swapRate1USD: 1.14,
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
  protocolFee: "0.15",
  swapRateAction: SwapRateAction.ATOB,
  routerFee: 0,
  gasEstimateSuccess: true,
};

const swapTokenInfo: SwapTokenInfo = {
  tokenA: {
    token: tokenA,
    amount: "1",
    balance: "10",
    usd: 1,
    usdStr: "1",
    priceGrade: "NONE",
    decimals: tokenA.decimals,
  },
  tokenB: {
    token: tokenB,
    amount: "2",
    balance: "10",
    usd: 0.5,
    usdStr: "0.5",
    priceGrade: "NONE",
    decimals: tokenB.decimals,
  },
  direction: "EXACT_IN",
  slippage: 0.5,
};

describe("SwapCardContentDetail Component", () => {
  it.each([
    { action: SwapRateAction.ATOB, expected: "1 FOO = 1.14 BAR", nextAction: SwapRateAction.BTOA },
    { action: SwapRateAction.BTOA, expected: "1 BAR = 1.14 FOO", nextAction: SwapRateAction.ATOB },
  ])("shows the exchange rate and toggles direction for $action", ({ action, expected, nextAction }) => {
    const setSwapRateAction = jest.fn();
    const mockProps: SwapCardContentDetailProps = {
      swapSummaryInfo: { ...swapSummaryInfo, swapRateAction: action },
      swapRouteInfos: [],
      swapTokenInfo: swapTokenInfo,
      setSwapRateAction,
      isLoading: false,
      priceImpactStatus: "MEDIUM",
      isLoadingGasInfo: false,
      connectedWallet: false,
    };

    const { container } = render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <SwapCardContentDetail {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );

    const exchangeRate = container.querySelector(".swap-rate");
    expect(exchangeRate).toHaveTextContent(expected);
    if (!exchangeRate) throw new Error("Expected the exchange rate to be rendered");
    fireEvent.click(exchangeRate);
    expect(setSwapRateAction).toHaveBeenCalledTimes(1);
    expect(setSwapRateAction).toHaveBeenCalledWith(nextAction);
  });
});
