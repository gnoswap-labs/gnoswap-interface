import { fireEvent, render, screen } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";

import { DCA_INTERVAL_UNITS } from "@models/order/dca-order-model";
import { DcaOrderSummary } from "@models/order/order-summary";
import { TokenModel } from "@models/token/token-model";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";

import DcaOrderCard, { DcaOrderCardProps } from "./DcaOrderCard";

jest.mock("@hooks/common/use-gnoswap-context", () => ({
  useGnoswapContext: () => ({ transactionGasService: null }),
  useOptionalGnoswapContext: () => null,
}));

jest.mock("@adena-wallet/sdk", () => ({
  makeMsgCallMessage: jest.fn(),
  makeMsgSendMessage: jest.fn(),
  TransactionBuilder: jest.fn(),
}));

const token = (symbol: string): TokenModel => ({
  type: "GRC20",
  chainId: "",
  createdAt: "",
  name: symbol,
  path: `gno.land/r/demo/${symbol.toLowerCase()}`,
  decimals: 6,
  symbol,
  displaySymbol: symbol,
  logoURI: "",
  priceID: symbol,
});

const summary: DcaOrderSummary = {
  inputToken: token("GNS"),
  outputToken: token("GNOT"),
  sellAmount: "1500",
  sellAmountUsd: "$1,541.02",
  actualSellAmount: null,
  intervalUnit: "minute",
  executionCount: 2,
  rate: "1 GNS = 1.04 GNOT",
  rateUsd: "$1.04",
  amountPerOrder: "750",
  estimatedEndDate: "2026-11-03 20:35:36",
  routerFee: "0.15%",
  executionFee: "0.1%",
  networkGasFee: "0.002451 GNOT",
  networkGasFeeUsd: "$0.12",
};

const renderCard = (props: Partial<DcaOrderCardProps> = {}) => {
  const defaults: DcaOrderCardProps = {
    swapType: "dca",
    changeSwapType: jest.fn(),
    copied: false,
    copyURL: jest.fn(),
    themeKey: "dark",
    isLoading: false,
    connectedWallet: true,
    tokenA: token("GNS"),
    tokenB: token("GNOT"),
    tokenABalance: "2000",
    sellAmount: "1500",
    sellAmountUsd: "$1,541.02",
    changeTokenA: jest.fn(),
    changeTokenB: jest.fn(),
    changeSellAmount: jest.fn(),
    switchTokens: jest.fn(),
    interval: 60,
    intervalOptions: DCA_INTERVAL_UNITS,
    changeInterval: jest.fn(),
    executionCountInput: "2",
    maxExecutionCount: 30,
    changeExecutionCount: jest.fn(),
    commitExecutionCount: jest.fn(),
    summary,
    buttonState: "PLACE_ORDER",
    buttonText: "Place Order",
    minTradingText: "Minimum 0.000001 GNS per order",
    onClickButton: jest.fn(),
  };

  return render(
    <JotaiProvider>
      <GnoswapThemeProvider>
        <DcaOrderCard {...defaults} {...props} />
      </GnoswapThemeProvider>
    </JotaiProvider>,
  );
};

describe("DcaOrderCard", () => {
  it("renders the form with the order details", () => {
    renderCard();

    expect(screen.getByText("Swap:dca.toBuy")).toBeInTheDocument();
    expect(screen.getByText("Swap:dca.every")).toBeInTheDocument();
    expect(screen.getByText("Swap:dca.over")).toBeInTheDocument();
    expect(screen.getByText("750 GNS")).toBeInTheDocument();
    expect(screen.getByText("2026-11-03 20:35:36")).toBeInTheDocument();
    expect(screen.getByText("Swap:dca.executionFee")).toBeInTheDocument();
    expect(screen.getByText("0.1%")).toBeInTheDocument();
  });

  it("places the order from the primary button", () => {
    const onClickButton = jest.fn();
    renderCard({ onClickButton });

    fireEvent.click(screen.getByRole("button", { name: "Place Order" }));
    expect(onClickButton).toHaveBeenCalled();
  });

  it("disables the button and explains the minimum when the amount is too low", () => {
    const onClickButton = jest.fn();
    renderCard({ buttonState: "AMOUNT_TOO_LOW", buttonText: "Amount Too Low", onClickButton });

    const button = screen.getByRole("button", { name: "Amount Too Low" });
    expect(button).toBeDisabled();
    expect(screen.getByText("Minimum 0.000001 GNS per order")).toBeInTheDocument();
    fireEvent.click(button);
    expect(onClickButton).not.toHaveBeenCalled();
  });

  it("commits the Over value on blur", () => {
    const commitExecutionCount = jest.fn();
    renderCard({ commitExecutionCount });

    fireEvent.blur(screen.getByLabelText("Swap:dca.over"));
    expect(commitExecutionCount).toHaveBeenCalled();
  });

  it("offers no slippage setting, which a DCA order does not take", () => {
    const { container } = renderCard();

    // Only the copy-link control remains in the header.
    expect(container.querySelectorAll(".setting-wrap")).toHaveLength(1);
  });

  it("shows a skeleton while the config loads", () => {
    renderCard({ isLoading: true });
    expect(screen.getByTestId("order-card-skeleton")).toBeInTheDocument();
  });
});
