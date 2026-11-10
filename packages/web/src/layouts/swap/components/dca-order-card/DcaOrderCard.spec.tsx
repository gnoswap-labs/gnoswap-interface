import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import { useState } from "react";

import { GNOT_TOKEN } from "@common/values/token-constant";
import { getOrderButtonState, OrderButtonState } from "@hooks/order/data/use-order-handler.utils";
import { DCA_INTERVAL_UNITS } from "@models/order/dca-order-model";
import { DcaOrderSummary } from "@models/order/order-summary";
import { TokenModel } from "@models/token/token-model";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";

import DcaOrderCard, { DcaOrderCardProps } from "./DcaOrderCard";

const mockEstimateMaxNativeAmount = jest.fn();

jest.mock("@hooks/common/use-gnoswap-context", () => ({
  useGnoswapContext: () => ({ transactionGasService: null }),
  // What GNOT Max asks to price the order; each Max test decides how it answers.
  useOptionalGnoswapContext: () => ({
    transactionGasService: { estimateMaxNativeAmount: mockEstimateMaxNativeAmount },
  }),
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
  executionFee: "0.1%",
};

/** The retry the order button offers after a failed Max, read here as its translation key. */
const RETRY_MAX = "Swap:swapButton.retryMaxCalculation";
/** The estimator's answer for this order out of 10 GNOT: 8.5 GNOT, priced by a simulation. */
const PRICED = { amount: "8500000", reserve: {}, simulated: true };

/** The labels the handler gives the order button, as these tests read them. */
const BUTTON_TEXT: Partial<Record<OrderButtonState, string>> = {
  ENTER_AMOUNT: "Enter Amount",
  PLACE_ORDER: "Place Order",
};

/**
 * The card as its container drives it: what Max writes into the sell field is
 * the amount the card is given next, and the button follows that amount the
 * way the handler works it out for a connected form with nothing else missing.
 */
const ControlledCard = ({ changeSellAmount, ...props }: DcaOrderCardProps) => {
  const [sellAmount, setSellAmount] = useState(props.sellAmount);
  const buttonState = getOrderButtonState({
    connected: true,
    isSwitchNetwork: false,
    isPaused: false,
    hasTokens: true,
    amount: sellAmount,
    balance: props.tokenABalance,
    hasLiquidity: true,
    isAmountTooLow: false,
  });

  return (
    <DcaOrderCard
      {...props}
      sellAmount={sellAmount}
      changeSellAmount={value => {
        changeSellAmount(value);
        setSellAmount(value);
      }}
      buttonState={buttonState}
      buttonText={BUTTON_TEXT[buttonState] ?? buttonState}
    />
  );
};

const renderCard = (props: Partial<DcaOrderCardProps> = {}, { controlled = false } = {}) => {
  const changeSellAmount = jest.fn();
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
    changeSellAmount,
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
  const element = (overrides: Partial<DcaOrderCardProps> = {}) => {
    const cardProps = { ...defaults, ...props, ...overrides };

    return (
      <JotaiProvider>
        <GnoswapThemeProvider>
          {controlled ? <ControlledCard {...cardProps} /> : <DcaOrderCard {...cardProps} />}
        </GnoswapThemeProvider>
      </JotaiProvider>
    );
  };
  const view = render(element());

  return {
    ...view,
    changeSellAmount,
    rerender: (overrides: Partial<DcaOrderCardProps>) => view.rerender(element(overrides)),
  };
};

/** A GNOT sell field holding 10, whose Max prices the order's own messages. */
const gnotMax = (): Partial<DcaOrderCardProps> => ({
  tokenA: GNOT_TOKEN,
  tokenB: token("GNS"),
  tokenABalance: "10",
  sellAmount: "",
  summary: null,
  makeMaxAmountMessages: jest.fn(),
  maxAmountDependsOn: ["gno.land/r/demo/gns", 60, 2],
  buttonState: "ENTER_AMOUNT",
  buttonText: "Enter Amount",
});

const maxButton = () => screen.getByRole("button", { name: "common:max" });
/** The sell field is the first in the form. */
const sellInput = () => screen.getAllByRole("textbox")[0];

describe("DcaOrderCard", () => {
  it("renders the form with the order details", () => {
    renderCard();

    expect(screen.getByText("Swap:dca.every")).toBeInTheDocument();
    expect(screen.getByText("Swap:dca.over")).toBeInTheDocument();
    expect(screen.getByText("1 GNS = 1.04 GNOT")).toBeInTheDocument();
    expect(screen.getByText("2026-11-03 20:35:36")).toBeInTheDocument();
    expect(screen.getByText("Swap:dca.executionFee")).toBeInTheDocument();
    // Placing an order shows no network gas fee.
    expect(screen.queryByText("Swap:swapInfo.gasFee")).not.toBeInTheDocument();
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

describe("DcaOrderCard Max", () => {
  beforeEach(() => mockEstimateMaxNativeAmount.mockReset());

  it("retries a failed Max from the order button, which fills the amount and places nothing", async () => {
    mockEstimateMaxNativeAmount.mockRejectedValueOnce(new Error("RPC unavailable")).mockResolvedValueOnce(PRICED);
    const makeMaxAmountMessages = jest.fn();
    const onClickButton = jest.fn();
    // The field still holds an amount from before.
    const { changeSellAmount } = renderCard(
      { ...gnotMax(), sellAmount: "5", makeMaxAmountMessages, onClickButton },
      { controlled: true },
    );

    fireEvent.click(maxButton());

    // Nothing is known to be spendable, so the earlier amount is not left in place to be ordered.
    await waitFor(() => expect(sellInput()).toHaveValue("0"));
    const retry = screen.getByRole("button", { name: RETRY_MAX });
    expect(retry).toBeEnabled();
    expect(screen.queryByText(/RPC unavailable/)).not.toBeInTheDocument();

    fireEvent.click(retry);

    await waitFor(() => expect(sellInput()).toHaveValue("8.5"));
    // The same estimate the field's own Max asks for: this order's messages, out of the whole balance.
    const [maxRequest, retryRequest] = mockEstimateMaxNativeAmount.mock.calls;
    expect(maxRequest).toEqual([{ balance: "10000000", makeMessages: makeMaxAmountMessages }]);
    expect(retryRequest).toEqual(maxRequest);
    expect(changeSellAmount.mock.calls).toEqual([["0"], ["8.5"]]);
    expect(onClickButton).not.toHaveBeenCalled();

    // The order is placed by a press of its own.
    fireEvent.click(screen.getByRole("button", { name: "Place Order" }));
    expect(onClickButton).toHaveBeenCalledTimes(1);
  });

  it("holds the order while Max is worked out, even over an amount already in the field", async () => {
    const estimate = Promise.withResolvers<typeof PRICED>();
    mockEstimateMaxNativeAmount.mockReturnValue(estimate.promise);
    const onClickButton = jest.fn();
    renderCard({ ...gnotMax(), sellAmount: "5", onClickButton }, { controlled: true });

    fireEvent.click(maxButton());

    // The field stands the whole balance in for the amount on its way.
    await waitFor(() => expect(sellInput()).toHaveAttribute("placeholder", "10"));
    expect(sellInput()).toHaveValue("");
    const placeOrder = screen.getByRole("button", { name: "Place Order" });
    expect(placeOrder).toBeDisabled();
    fireEvent.click(placeOrder);
    expect(onClickButton).not.toHaveBeenCalled();

    await act(async () => estimate.resolve(PRICED));

    expect(sellInput()).toHaveValue("8.5");
    fireEvent.click(screen.getByRole("button", { name: "Place Order" }));
    expect(onClickButton).toHaveBeenCalledTimes(1);
  });

  it("goes back to the usual order once the user types over a failed Max", async () => {
    mockEstimateMaxNativeAmount.mockRejectedValue(new Error("RPC unavailable"));
    const onClickButton = jest.fn();
    renderCard({ ...gnotMax(), onClickButton }, { controlled: true });

    fireEvent.click(maxButton());
    await waitFor(() => expect(sellInput()).toHaveValue("0"));

    // Clearing the zero the failure left asks for an amount again, not for another Max.
    fireEvent.change(sellInput(), { target: { value: "" } });
    expect(screen.queryByRole("button", { name: RETRY_MAX })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Enter Amount" })).toBeDisabled();

    fireEvent.change(sellInput(), { target: { value: "3" } });
    fireEvent.click(screen.getByRole("button", { name: "Place Order" }));

    expect(onClickButton).toHaveBeenCalledTimes(1);
    expect(mockEstimateMaxNativeAmount).toHaveBeenCalledTimes(1);
  });

  it("keeps an amount typed while Max was still out, even the one the field already held", async () => {
    const estimate = Promise.withResolvers<typeof PRICED>();
    mockEstimateMaxNativeAmount.mockReturnValue(estimate.promise);
    const { changeSellAmount } = renderCard({ ...gnotMax(), sellAmount: "3" }, { controlled: true });

    fireEvent.click(maxButton());
    await waitFor(() => expect(sellInput()).toHaveValue(""));
    fireEvent.change(sellInput(), { target: { value: "3" } });
    await act(async () => estimate.resolve(PRICED));

    expect(changeSellAmount).not.toHaveBeenCalledWith("8.5");
    expect(sellInput()).toHaveValue("3");
    expect(screen.getByRole("button", { name: "Place Order" })).toBeEnabled();
  });

  it("offers no retry when the balance cannot cover the order's own costs", async () => {
    mockEstimateMaxNativeAmount.mockResolvedValue({ ...PRICED, amount: "0" });
    renderCard({ ...gnotMax(), sellAmount: "5" }, { controlled: true });

    fireEvent.click(maxButton());

    // A zero the estimate arrives at is an answer, so there is nothing to retry.
    await waitFor(() => expect(sellInput()).toHaveValue("0"));
    expect(screen.queryByRole("button", { name: RETRY_MAX })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Enter Amount" })).toBeDisabled();
  });

  it.each([
    { state: "WALLET_LOGIN", text: "Wallet Login", acts: true },
    { state: "SWITCH_NETWORK", text: "Switch Network", acts: true },
    { state: "ORDER_PAUSED", text: "Order Paused", acts: false },
    { state: "SELECT_TOKEN", text: "Select Token", acts: false },
  ] as const)("leaves $state to the order button after a failed Max", async ({ state, text, acts }) => {
    mockEstimateMaxNativeAmount.mockRejectedValue(new Error("RPC unavailable"));
    const onClickButton = jest.fn();
    const { rerender } = renderCard({ ...gnotMax(), onClickButton });
    fireEvent.click(maxButton());
    await screen.findByRole("button", { name: RETRY_MAX });

    rerender({ buttonState: state, buttonText: text });

    expect(screen.queryByRole("button", { name: RETRY_MAX })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: text }));
    expect(onClickButton).toHaveBeenCalledTimes(acts ? 1 : 0);
    expect(mockEstimateMaxNativeAmount).toHaveBeenCalledTimes(1);
  });

  it("runs GNOT Max from neither button until the order terms it prices are settled", async () => {
    mockEstimateMaxNativeAmount.mockRejectedValue(new Error("RPC unavailable"));
    const { rerender } = renderCard({ ...gnotMax(), isMaxAmountReady: false });

    expect(maxButton()).toBeDisabled();
    fireEvent.click(maxButton());
    expect(mockEstimateMaxNativeAmount).not.toHaveBeenCalled();

    rerender({ isMaxAmountReady: true });
    fireEvent.click(maxButton());
    await screen.findByRole("button", { name: RETRY_MAX });

    // The schedule goes back to loading before the retry is pressed.
    rerender({ isMaxAmountReady: false });
    fireEvent.click(screen.getByRole("button", { name: RETRY_MAX }));
    expect(screen.getByRole("button", { name: RETRY_MAX })).toBeDisabled();
    expect(mockEstimateMaxNativeAmount).toHaveBeenCalledTimes(1);

    rerender({ isMaxAmountReady: true });
    expect(screen.getByRole("button", { name: RETRY_MAX })).toBeEnabled();
  });

  it("fills Max on a token that pays no fee at once, schedule or not", async () => {
    const { changeSellAmount } = renderCard({
      sellAmount: "",
      isMaxAmountReady: false,
      buttonState: "ENTER_AMOUNT",
      buttonText: "Enter Amount",
    });

    fireEvent.click(maxButton());

    await waitFor(() => expect(changeSellAmount).toHaveBeenCalledWith("2000"));
    expect(mockEstimateMaxNativeAmount).not.toHaveBeenCalled();
  });

  it.each([
    { change: "other order terms", movedOn: { maxAmountDependsOn: ["gno.land/r/demo/gns", 60, 5] } },
    { change: "a new balance", movedOn: { tokenABalance: "12" } },
    { change: "another sell token", movedOn: { tokenA: token("GNS") } },
  ])("does not carry a failed Max over to $change", async ({ movedOn }) => {
    mockEstimateMaxNativeAmount.mockRejectedValue(new Error("RPC unavailable"));
    const { rerender } = renderCard(gnotMax());
    fireEvent.click(maxButton());
    await screen.findByRole("button", { name: RETRY_MAX });

    rerender(movedOn);

    expect(screen.queryByRole("button", { name: RETRY_MAX })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Enter Amount" })).toBeDisabled();
  });

  it.each([
    { outcome: "answer", settle: (estimate: PromiseWithResolvers<typeof PRICED>) => estimate.resolve(PRICED) },
    {
      outcome: "failure",
      settle: (estimate: PromiseWithResolvers<typeof PRICED>) => estimate.reject(new Error("RPC unavailable")),
    },
  ])("drops an $outcome for order terms that changed while Max was out", async ({ settle }) => {
    const estimate = Promise.withResolvers<typeof PRICED>();
    mockEstimateMaxNativeAmount.mockReturnValue(estimate.promise);
    const { changeSellAmount, rerender } = renderCard(gnotMax());

    fireEvent.click(maxButton());
    // The execution count changes before the estimate comes back.
    rerender({ maxAmountDependsOn: ["gno.land/r/demo/gns", 60, 5] });
    await act(async () => settle(estimate));

    expect(changeSellAmount).not.toHaveBeenCalled();
    expect(screen.queryByRole("button", { name: RETRY_MAX })).not.toBeInTheDocument();
  });
});
