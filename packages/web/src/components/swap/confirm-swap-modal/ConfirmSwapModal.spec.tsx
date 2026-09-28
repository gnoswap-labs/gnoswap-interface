import { render, screen } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";

import { SwapRateAction } from "@hooks/swap/data/use-swap-handler";
import { SwapSummaryInfo } from "@models/swap/swap-summary-info";
import { SwapTokenInfo } from "@models/swap/swap-token-info";
import { TokenModel } from "@models/token/token-model";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";

import ConfirmSwapModal from "./ConfirmSwapModal";

jest.mock("@adena-wallet/sdk", () => ({
  makeMsgCallMessage: jest.fn(),
  makeMsgSendMessage: jest.fn(),
  TransactionBuilder: jest.fn(),
}));

const createToken = (symbol: string): TokenModel => ({
  type: "GRC20",
  chainId: "dev.gnoswap",
  createdAt: "2023-12-08T03:57:43Z",
  name: symbol,
  path: `gno.land/r/demo/${symbol.toLowerCase()}`,
  decimals: 6,
  symbol,
  displaySymbol: symbol,
  logoURI: "",
  priceID: `gno.land/r/demo/${symbol.toLowerCase()}`,
});

const tokenA = createToken("GNOT");
const tokenB = createToken("GNS");
const swapTokenInfo: SwapTokenInfo = {
  tokenA,
  tokenB,
  tokenAAmount: "1",
  tokenBAmount: "1.898308",
  tokenABalance: "1000",
  tokenBBalance: "1000",
  tokenAUSD: 0.07,
  tokenBUSD: 38,
  tokenAUSDStr: "$0.07",
  tokenBUSDStr: "$38",
  tokenAPriceGrade: "NONE",
  tokenBPriceGrade: "NONE",
  direction: "EXACT_IN",
  slippage: 0.5,
};
const swapSummaryInfo: SwapSummaryInfo = {
  tokenA,
  tokenB,
  swapDirection: "EXACT_IN",
  swapRate: 0.526785,
  swapRateUSD: 38,
  priceImpact: 0,
  guaranteedAmount: { amount: 1.888816, currency: "GNS" },
  swapRateAction: SwapRateAction.BTOA,
  swapRate1USD: 20,
  protocolFee: "0.15%",
  routerFee: 0.15,
};

const renderModal = (isWrapOrUnwrap: boolean) =>
  render(
    <JotaiProvider>
      <GnoswapThemeProvider>
        <ConfirmSwapModal
          submitted={false}
          swapResult={null}
          title="Confirm"
          isWrapOrUnwrap={isWrapOrUnwrap}
          priceImpactStatus="NONE"
          isLoading={false}
          isRefetching={false}
          swapTokenInfo={swapTokenInfo}
          swapSummaryInfo={swapSummaryInfo}
          estimatedAmount="1.898308"
          setSwapRateAction={jest.fn()}
          swap={jest.fn()}
          close={jest.fn()}
        />
      </GnoswapThemeProvider>
    </JotaiProvider>,
  );

describe("ConfirmSwapModal details", () => {
  it("does not render an empty detail panel for wrap or unwrap", () => {
    const { container } = renderModal(true);

    expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
    expect(container.querySelector(".gas-info")).not.toBeInTheDocument();
  });

  it("keeps transaction details for regular swaps", () => {
    const { container } = renderModal(false);

    expect(container.querySelector(".gas-info .price-impact")).toBeInTheDocument();
  });

  it("shows the current 111-unit quote rather than a previously cached 1-unit quote", () => {
    const currentQuote = { ...swapTokenInfo, tokenAAmount: "111", tokenBAmount: "200.158845" };
    const { container } = render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <ConfirmSwapModal
            submitted={false}
            swapResult={null}
            title="Confirm"
            isWrapOrUnwrap={false}
            priceImpactStatus="NONE"
            isLoading={false}
            isRefetching={false}
            swapTokenInfo={currentQuote}
            swapSummaryInfo={{ ...swapSummaryInfo, swapRate: 0.55456 }}
            estimatedAmount="200.158845"
            setSwapRateAction={jest.fn()}
            swap={jest.fn()}
            close={jest.fn()}
          />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );

    expect(container.querySelector(".first-section .amount-container")?.textContent).toContain("111");
    expect(container.querySelector(".second-section .amount-container")?.textContent).toContain("200.158845");
    expect(container.querySelector(".second-section .amount-container")?.textContent).not.toContain("1.898308");
  });
});
