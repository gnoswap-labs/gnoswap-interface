import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import SwapCardContent from "./SwapCardContent";
import { SwapTokenInfo } from "@models/swap/swap-token-info";
import { PriceImpactStatus } from "@hooks/swap/use-swap-handler";

const swapTokenInfo: SwapTokenInfo = {
  tokenA: {
    type: "grc20",
    chainId: "dev.gnoswap",
    createdAt: "2023-12-08T03:57:43Z",
    name: "Foo",
    path: "gno.land/r/foo",
    decimals: 4,
    symbol: "FOO",
    logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_foo.svg",
    priceID: "gno.land/r/foo",
    address: ""
  },
  tokenAAmount: "",
  tokenABalance: "",
  tokenAUSD: 0,
  tokenAUSDStr: "0",
  tokenB: {
    type: "grc20",
    chainId: "dev.gnoswap",
    createdAt: "2023-12-08T03:57:43Z",
    name: "Foo",
    path: "gno.land/r/foo",
    decimals: 4,
    symbol: "FOO",
    logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_foo.svg",
    priceID: "gno.land/r/foo",
    address: ""
  },
  tokenBAmount: "",
  tokenBBalance: "",
  tokenBUSD: 0,
  tokenBUSDStr: "0",
  direction: "EXACT_IN",
  slippage: 10
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
      setSwapRateAction: (type: "ATOB" | "BTOA") => null,
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
