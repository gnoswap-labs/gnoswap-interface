import { PriceImpactStatus, SwapRateAction } from "@hooks/swap/data/use-swap-handler";
import { SwapSummaryInfo } from "@models/swap/swap-summary-info";
import { SwapTokenInfo } from "@models/swap/swap-token-info";
import { TokenModel } from "@models/token/token-model";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import SwapCardFeeInfo from "./SwapCardFeeInfo";

// Mock @adena-wallet/sdk
jest.mock("@adena-wallet/sdk", () => ({
  makeMsgCallMessage: jest.fn(),
  makeMsgSendMessage: jest.fn(),
  TransactionBuilder: jest.fn(),
}));

const createToken = (symbol: string, decimals = 6): TokenModel => ({
  type: "GRC20",
  chainId: "dev.gnoswap",
  createdAt: "2023-12-08T03:57:43Z",
  name: symbol,
  path: `gno.land/r/demo/${symbol.toLowerCase()}`,
  decimals,
  symbol,
  displaySymbol: symbol,
  logoURI: "",
  priceID: `gno.land/r/demo/${symbol.toLowerCase()}`,
});

const tokenA = createToken("GNOT");
const tokenB = createToken("GNS");

// 1000 GNOT -> 121.885688 GNS. The pools output 122.068791 GNS and the router keeps 0.183103 GNS of it.
const swapSummaryInfo: SwapSummaryInfo = {
  tokenA,
  tokenB,
  swapDirection: "EXACT_IN",
  swapRate: 0.121885688,
  swapRateUSD: 2437.71376,
  priceImpact: 0.3,
  guaranteedAmount: {
    amount: 121.276259,
    currency: "GNS",
  },
  swapRate1USD: 20,
  swapRateAction: SwapRateAction.ATOB,
  protocolFee: "0.15%",
  routerFeeAmountRaw: "183103",
  tokenBPriceUSD: 20,
};

const swapTokenInfo: SwapTokenInfo = {
  tokenA,
  tokenAAmount: "1000",
  tokenABalance: "5000",
  tokenAUSD: 2450,
  tokenAUSDStr: "$2,450",
  tokenAPriceGrade: "NONE",
  tokenB,
  tokenBAmount: "121.885688",
  tokenBBalance: "0",
  tokenBUSD: 2437.71376,
  tokenBUSDStr: "$2,437.71",
  tokenBPriceGrade: "NONE",
  direction: "EXACT_IN",
  slippage: 0.5,
};

const renderFeeInfo = (summary: Partial<SwapSummaryInfo> = {}) =>
  render(
    <JotaiProvider>
      <GnoswapThemeProvider>
        <SwapCardFeeInfo
          swapSummaryInfo={{ ...swapSummaryInfo, ...summary }}
          swapTokenInfo={swapTokenInfo}
          isLoading={false}
          priceImpactStatus={"LOW" as PriceImpactStatus}
        />
      </GnoswapThemeProvider>
    </JotaiProvider>,
  );

/** The value shown on the protocol fee row. */
const getFeeValue = (container: HTMLElement) => container.querySelector(".protocol")?.nextElementSibling;

describe("SwapCardFeeInfo router fee", () => {
  it("shows the fee the quote reports in dollars", () => {
    const { container } = renderFeeInfo();

    // 0.183103 GNS at $20. Taking 0.15% of the 121.885688 GNS output instead would give $3.65.
    expect(getFeeValue(container)).toHaveTextContent("$3.66");
  });

  it("shows the fee amount in the output token when it has no price", () => {
    const { container } = renderFeeInfo({ tokenBPriceUSD: null });

    expect(getFeeValue(container)).toHaveTextContent("0.183103 GNS");
  });

  it("shows a true zero fee as zero", () => {
    const { container } = renderFeeInfo({ protocolFee: "0%", routerFeeAmountRaw: "0" });

    expect(getFeeValue(container)).toHaveTextContent(/^\$0$/);
  });

  it("shows a dash instead of a fee worked out from the rate when the quote has none", () => {
    const { container } = renderFeeInfo({ routerFeeAmountRaw: null });

    expect(getFeeValue(container)).toHaveTextContent(/^-$/);
    expect(container.querySelector(".protocol")).toHaveTextContent("(0.15%)");
  });
});
