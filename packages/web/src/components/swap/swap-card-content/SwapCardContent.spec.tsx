import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import SwapCardContent from "./SwapCardContent";
import { SwapTokenInfo } from "@models/swap/swap-token-info";

const swapTokenInfo: SwapTokenInfo = {
  tokenA: {
    chainId: "test3",
    address: "0x111111111117dC0aa78b770fA6A738034120C302",
    path: "gno.land/r/demo/1inch",
    name: "1inch",
    symbol: "1INCH",
    decimals: 6,
    logoURI: "https://assets.coingecko.com/coins/images/13469/thumb/1inch-token.png?1608803028",
    type: "grc20",
    priceId: "1inch",
    createdAt: "1999-01-01T00:00:01Z"
  },
  tokenAAmount: "",
  tokenABalance: "",
  tokenAUSD: 0,
  tokenAUSDStr: "0",
  tokenB: {
    chainId: "test3",
    address: "0x111111111117dC0aa78b770fA6A738034120C302",
    path: "gno.land/r/demo/1inch",
    name: "1inch",
    symbol: "1INCH",
    decimals: 6,
    logoURI: "https://assets.coingecko.com/coins/images/13469/thumb/1inch-token.png?1608803028",
    type: "grc20",
    priceId: "1inch",
    createdAt: "1999-01-01T00:00:01Z"
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
      changeSlippage: () => null,
      switchSwapDirection: () => null
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
