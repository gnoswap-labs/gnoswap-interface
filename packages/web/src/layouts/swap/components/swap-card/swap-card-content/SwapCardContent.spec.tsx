import { PriceImpactStatus, SwapRateAction } from "@hooks/swap/data/use-swap-handler";
import { SwapTokenInfo } from "@models/swap/swap-token-info";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { fireEvent, render, screen } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import SwapCardContent from "./SwapCardContent";

// Mock @adena-wallet/sdk
jest.mock("@adena-wallet/sdk", () => ({
  makeMsgCallMessage: jest.fn(),
  makeMsgSendMessage: jest.fn(),
  TransactionBuilder: jest.fn(),
}));

const swapTokenInfo: SwapTokenInfo = {
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
  tokenAAmount: "",
  tokenABalance: "",
  tokenAUSD: 0,
  tokenAUSDStr: "0",
  tokenAPriceGrade: "NONE",
  tokenBPriceGrade: "NONE",
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
  tokenBAmount: "",
  tokenBBalance: "",
  tokenBUSD: 0,
  tokenBUSDStr: "0",
  direction: "EXACT_IN",
  slippage: 10,
};

const mockProps = {
  swapTokenInfo,
  swapSummaryInfo: null,
  swapRouteInfos: [],
  changeTokenA: () => null,
  changeTokenAAmount: () => null,
  changeTokenB: () => null,
  changeTokenBAmount: () => null,
  switchSwapDirection: () => null,
  connectedWallet: false,
  isLoading: false,
  setSwapRateAction: (type: SwapRateAction) => {
    console.log(type);
  },
  isSwitchNetwork: false,
  priceImpactStatus: "NONE" as PriceImpactStatus,
  isSameToken: false,
  resetEstimatedLiquidity: (): void => {},
  isRefetching: false,
};

describe("SwapCardContent Component", () => {
  it("SwapCardContent render", () => {
    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <SwapCardContent {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });

  it("fills the exact token balance when Max is selected", () => {
    const changeTokenAAmount = jest.fn();

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <SwapCardContent
            {...mockProps}
            connectedWallet
            changeTokenAAmount={changeTokenAAmount}
            swapTokenInfo={{ ...swapTokenInfo, tokenABalance: "99999999999.999995" }}
          />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /max/i }));

    expect(changeTokenAAmount).toHaveBeenCalledWith("99999999999.999995");
  });
});
