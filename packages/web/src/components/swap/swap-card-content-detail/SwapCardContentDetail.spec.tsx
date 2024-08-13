import { Provider as JotaiProvider } from "jotai";
import { render } from "@testing-library/react";

import { SwapSummaryInfo } from "@models/swap/swap-summary-info";
import { SwapTokenInfo } from "@models/swap/swap-token-info";
import { TokenModel } from "@models/token/token-model";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";

import SwapCardContentDetail, { SwapCardContentDetailProps } from "./SwapCardContentDetail";

const tokenA: TokenModel = {
  type: "grc20",
  chainId: "dev.gnoswap",
  createdAt: "2023-12-08T03:57:43Z",
  name: "Foo",
  path: "gno.land/r/foo",
  decimals: 4,
  symbol: "FOO",
  logoURI:
    "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_foo.svg",
  priceID: "gno.land/r/foo",
  address: "",
};

const tokenB: TokenModel = {
    type: "grc20",
    chainId: "dev.gnoswap",
    createdAt: "2023-12-08T03:57:43Z",
    name: "Foo",
    path: "gno.land/r/foo",
    decimals: 4,
    symbol: "FOO",
    logoURI:
      "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_foo.svg",
    priceID: "gno.land/r/foo",
    address: "",
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
  swapRateAction: "ATOB",
};

const swapTokenInfo: SwapTokenInfo = {
  direction: "EXACT_IN",
  slippage: 0.5,
  tokenA: tokenA,
  tokenAAmount: "1",
  tokenABalance:"10",
  tokenAUSD : 1,
  tokenAUSDStr: "1",
  tokenADecimals: 6,
  tokenB: tokenB,
  tokenBAmount: "2",
  tokenBBalance: "10",
  tokenBUSD: 0.5,
  tokenBUSDStr: "0.5",
  tokenBDecimals: 6
};

describe("SwapCardContentDetail Component", () => {
  it("SwapCardContentDetail render", () => {
    const mockProps: SwapCardContentDetailProps = {
      swapSummaryInfo,
      swapRouteInfos: [],
      swapTokenInfo: swapTokenInfo,
      setSwapRateAction: (type: "ATOB" | "BTOA") => {
        console.log(type);
      },
      isLoading: false,
      priceImpactStatus: "MEDIUM",
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <SwapCardContentDetail {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
