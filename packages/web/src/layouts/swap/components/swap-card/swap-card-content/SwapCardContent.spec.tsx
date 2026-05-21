import { PriceImpactStatus, SwapRateAction } from "@hooks/swap/data/use-swap-handler";
import { SwapTokenInfo } from "@models/swap/swap-token-info";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { render } from "@testing-library/react";
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
    tokenId: "gno.land/r/foo.FOO",
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
  tokenB: {
    type: "GRC20",
    chainId: "dev.gnoswap",
    createdAt: "2023-12-08T03:57:43Z",
    name: "Foo",
    path: "gno.land/r/foo",
    tokenId: "gno.land/r/foo.FOO",
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

describe("SwapCardContent Component", () => {
  it("SwapCardContent render", () => {
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
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <SwapCardContent {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
