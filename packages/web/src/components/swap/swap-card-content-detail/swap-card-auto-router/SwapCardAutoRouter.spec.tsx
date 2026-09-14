import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { SwapRateAction } from "@hooks/swap/data/use-swap-handler";
import { SwapSummaryInfo } from "@models/swap/swap-summary-info";
import SwapCardAutoRouter from "./SwapCardAutoRouter";

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

describe("SwapCard Component", () => {
  it("SwapCard render", () => {
    const mockProps = {
      swapRouteInfos: [],
      swapSummaryInfo,
      isLoading: false,
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <SwapCardAutoRouter {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
