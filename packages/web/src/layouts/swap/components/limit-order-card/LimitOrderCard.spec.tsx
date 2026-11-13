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
    switchTokens: jest.fn(),
    limitPrice: "1.25",
    limitPriceUsd: "-",
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
    rerender: (overrides: Partial<LimitOrderCardProps>) => view.rerender(element(overrides)),
  };
};

const maxButton = () => screen.getByRole("button", { name: "common:max" });

it("keeps the estimated Buy amount read-only without changing the sell amount", async () => {
  const user = userEvent.setup();
  const { changeSellAmount } = renderCard({ sellAmount: "10", buyAmount: "12.5" });
  const buyAmount = screen.getByDisplayValue("12.5");

  await user.type(buyAmount, "999");

  expect(buyAmount).toHaveValue("12.5");
  expect(screen.getByDisplayValue("10")).toHaveValue("10");
  expect(changeSellAmount).not.toHaveBeenCalled();
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

  it("holds Start to Order while Max is worked out over an amount already in the field", async () => {
    const estimate = Promise.withResolvers<typeof PRICED>();
    mockEstimateMaxNativeAmount.mockReturnValue(estimate.promise);
    const onClickButton = jest.fn();
    renderCard({ sellAmount: "5", buttonState: "PLACE_ORDER", buttonText: "Start to Order", onClickButton });

    fireEvent.click(maxButton());

    await waitFor(() => expect(screen.getByRole("button", { name: "Start to Order" })).toBeDisabled());
    fireEvent.click(screen.getByRole("button", { name: "Start to Order" }));
    expect(onClickButton).not.toHaveBeenCalled();

    await act(async () => estimate.resolve(PRICED));

    fireEvent.click(screen.getByRole("button", { name: "Start to Order" }));
    expect(onClickButton).toHaveBeenCalledTimes(1);
  });
});
