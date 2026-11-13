import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider as JotaiProvider } from "jotai";

import { GNOT_TOKEN } from "@common/values/token-constant";
import { TokenModel } from "@models/token/token-model";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";

import LimitOrderCard, { LimitOrderCardProps } from "./LimitOrderCard";

const mockEstimateMaxNativeAmount = jest.fn();

jest.mock("@hooks/common/use-gnoswap-context", () => ({
  useGnoswapContext: () => ({ transactionGasService: null }),
  // What GNOT Max asks to price the order; each test decides how it answers.
  useOptionalGnoswapContext: () => ({
    transactionGasService: { estimateMaxNativeAmount: mockEstimateMaxNativeAmount },
  }),
}));

jest.mock("@adena-wallet/sdk", () => ({
  makeMsgCallMessage: jest.fn(),
  makeMsgSendMessage: jest.fn(),
  TransactionBuilder: jest.fn(),
}));

const GNS: TokenModel = {
  type: "GRC20",
  chainId: "",
  createdAt: "",
  name: "GNS",
  path: "gno.land/r/demo/gns",
  decimals: 6,
  symbol: "GNS",
  displaySymbol: "GNS",
  logoURI: "",
  priceID: "GNS",
};

/** The retry the order button offers after a failed Max, read here as its translation key. */
const RETRY_MAX = "Swap:swapButton.retryMaxCalculation";
/** The estimator's answer for this order out of 10 GNOT: 8.5 GNOT, priced by a simulation. */
const PRICED = { amount: "8500000", reserve: {}, simulated: true };

/** A GNOT sell field holding 10 with nothing typed yet, whose Max prices the order's own messages. */
const renderCard = (props: Partial<LimitOrderCardProps> = {}) => {
  const changeSellAmount = jest.fn();
  const changeBuyAmount = jest.fn();
  const defaults: LimitOrderCardProps = {
    orderSide: "sell",
    changeOrderSide: jest.fn(),
    swapType: "limit",
    changeSwapType: jest.fn(),
    copied: false,
    copyURL: jest.fn(),
    slippage: 0.5,
    changeSlippage: jest.fn(),
    maxSlippage: 10,
    themeKey: "dark",
    isLoading: false,
    connectedWallet: true,
    tokenA: GNOT_TOKEN,
    tokenB: GNS,
    tokenABalance: "10",
    makeMaxAmountMessages: jest.fn(),
    maxAmountDependsOn: [GNS.path, "1.25", 86400, 50],
    tokenBBalance: "0",
    sellAmount: "",
    sellAmountUsd: "-",
    buyAmount: "",
    buyAmountUsd: "-",
    minimumReceived: "",
    executionFee: "-",
    changeTokenA: jest.fn(),
    changeTokenB: jest.fn(),
    changeSellAmount,
    changeBuyAmount,
    switchTokens: jest.fn(),
    limitPrice: "1.25",
    marketPrice: "1.25",
    selectedPreset: 0,
    changeLimitPrice: jest.fn(),
    stepPrice: jest.fn(),
    applyPreset: jest.fn(),
    expiry: 86400,
    expiryOptions: [{ value: 86400, label: "1 Day" }],
    changeExpiry: jest.fn(),
    buttonState: "ENTER_AMOUNT",
    buttonText: "Enter Amount",
    minTradingText: "Minimum 0.0001 GNOT",
    onClickButton: jest.fn(),
  };
  const element = (overrides: Partial<LimitOrderCardProps> = {}) => (
    <JotaiProvider>
      <GnoswapThemeProvider>
        <LimitOrderCard {...defaults} {...props} {...overrides} />
      </GnoswapThemeProvider>
    </JotaiProvider>
  );
  const view = render(element());

  return {
    changeSellAmount,
    changeBuyAmount,
    rerender: (overrides: Partial<LimitOrderCardProps>) => view.rerender(element(overrides)),
  };
};

const maxButton = () => screen.getByRole("button", { name: "common:max" });

describe("LimitOrderCard amount fields", () => {
  it("keeps the estimated amount read-only in Sell without changing either amount", async () => {
    const user = userEvent.setup();
    const { changeSellAmount, changeBuyAmount } = renderCard({ sellAmount: "10", buyAmount: "12.5" });
    const buyAmount = screen.getByDisplayValue("12.5");

    await act(async () => user.type(buyAmount, "999"));

    expect(buyAmount).toHaveAttribute("readonly");
    expect(buyAmount).toHaveValue("12.5");
    expect(screen.getByDisplayValue("10")).not.toHaveAttribute("readonly");
    expect(changeSellAmount).not.toHaveBeenCalled();
    expect(changeBuyAmount).not.toHaveBeenCalled();
  });

  it("makes the Buy funding amount read-only while keeping its token picker and Max", async () => {
    const user = userEvent.setup();
    const { changeSellAmount, changeBuyAmount } = renderCard({ orderSide: "buy", sellAmount: "10", buyAmount: "8" });
    const funding = screen.getByDisplayValue("10");

    await act(async () => user.type(funding, "5"));

    expect(funding).toHaveAttribute("readonly");
    expect(funding).not.toBeDisabled();
    expect(funding).toHaveValue("10");
    expect(changeSellAmount).not.toHaveBeenCalled();
    expect(changeBuyAmount).not.toHaveBeenCalled();
    expect(maxButton()).toBeEnabled();
  });

  it("lets Buy type the purchased quantity at the purchased token's precision", () => {
    const { changeSellAmount, changeBuyAmount, rerender } = renderCard({
      orderSide: "buy",
      sellAmount: "10",
      buyAmount: "",
    });
    const purchased = screen.getAllByPlaceholderText("0")[1];

    expect(purchased).not.toHaveAttribute("readonly");

    // GNS has six decimals: a seventh is refused, and non-numbers never reach the form.
    fireEvent.change(purchased, { target: { value: "1.1234567" } });
    fireEvent.change(purchased, { target: { value: "abc" } });
    expect(changeBuyAmount).not.toHaveBeenCalled();

    fireEvent.change(purchased, { target: { value: "1.123456" } });
    expect(changeBuyAmount).toHaveBeenLastCalledWith("1.123456");
    fireEvent.change(purchased, { target: { value: "007" } });
    expect(changeBuyAmount).toHaveBeenLastCalledWith("7");
    rerender({ buyAmount: "7" });
    fireEvent.change(purchased, { target: { value: "" } });
    expect(changeBuyAmount).toHaveBeenLastCalledWith("");
    expect(changeSellAmount).not.toHaveBeenCalled();
  });

  it("focuses the editable amount on side changes without stealing focus during subsequent price edits", () => {
    const { rerender } = renderCard({ sellAmount: "10", buyAmount: "8" });
    const funding = screen.getByDisplayValue("10");
    const purchased = screen.getByDisplayValue("8");
    expect(funding).toHaveFocus();
    rerender({ orderSide: "buy" });
    expect(purchased).toHaveFocus();
    expect(funding.tabIndex).toBe(-1);
    const price = screen.getByDisplayValue("1.25");
    act(() => price.focus());
    rerender({ orderSide: "buy", buyAmount: "9" });
    expect(price).toHaveFocus();
    rerender({ orderSide: "sell" });
    expect(funding).toHaveFocus();
    expect(purchased).toHaveAttribute("readonly");
    act(() => price.focus());
    rerender({ sellAmount: "11" });
    expect(price).toHaveFocus();
  });

  it("keeps a late Max answer from overwriting a quantity typed after it", async () => {
    const estimate = Promise.withResolvers<typeof PRICED>();
    mockEstimateMaxNativeAmount.mockReset();
    mockEstimateMaxNativeAmount.mockReturnValue(estimate.promise);
    const { changeSellAmount, changeBuyAmount } = renderCard({ orderSide: "buy", sellAmount: "5" });
    // Max replaces the funding field's placeholder while it works, so find the purchased field first.
    const purchased = screen.getAllByPlaceholderText("0")[1];

    fireEvent.click(maxButton());
    await waitFor(() => expect(mockEstimateMaxNativeAmount).toHaveBeenCalled());
    fireEvent.change(purchased, { target: { value: "3" } });
    await act(async () => estimate.resolve(PRICED));

    expect(changeBuyAmount).toHaveBeenCalledWith("3");
    expect(changeSellAmount).not.toHaveBeenCalled();
  });
});

describe("LimitOrderCard Max", () => {
  beforeEach(() => mockEstimateMaxNativeAmount.mockReset());

  it("retries a failed Max from the order button, which fills the amount and places nothing", async () => {
    mockEstimateMaxNativeAmount.mockRejectedValueOnce(new Error("RPC unavailable")).mockResolvedValueOnce(PRICED);
    const makeMaxAmountMessages = jest.fn();
    const onClickButton = jest.fn();
    const { changeSellAmount, rerender } = renderCard({ makeMaxAmountMessages, onClickButton });

    fireEvent.click(maxButton());
    await waitFor(() => expect(changeSellAmount).toHaveBeenCalledWith("0"));
    // The form puts the cleared amount back into the field, and still asks for one.
    rerender({ sellAmount: "0" });

    fireEvent.click(screen.getByRole("button", { name: RETRY_MAX }));

    await waitFor(() => expect(changeSellAmount).toHaveBeenLastCalledWith("8.5"));
    // The same estimate the field's own Max asks for: this order's messages, out of the whole balance.
    const [maxRequest, retryRequest] = mockEstimateMaxNativeAmount.mock.calls;
    expect(maxRequest).toEqual([{ balance: "10000000", makeMessages: makeMaxAmountMessages }]);
    expect(retryRequest).toEqual(maxRequest);
    expect(onClickButton).not.toHaveBeenCalled();
  });

  it("blocks order submission while Max is worked out over an amount already in the field", async () => {
    const estimate = Promise.withResolvers<typeof PRICED>();
    mockEstimateMaxNativeAmount.mockReturnValue(estimate.promise);
    const onClickButton = jest.fn();
    renderCard({ sellAmount: "5", buttonState: "PLACE_ORDER", buttonText: "Place Order", onClickButton });
    const orderButton = screen.getByRole("button", { name: "Place Order" });

    fireEvent.click(maxButton());

    await waitFor(() => expect(orderButton).toBeDisabled());
    fireEvent.click(orderButton);
    expect(onClickButton).not.toHaveBeenCalled();

    await act(async () => estimate.resolve(PRICED));

    fireEvent.click(orderButton);
    expect(onClickButton).toHaveBeenCalledTimes(1);
  });
});
