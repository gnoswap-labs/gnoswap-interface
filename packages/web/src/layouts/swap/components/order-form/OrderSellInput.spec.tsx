import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import React from "react";

import { GNOT_TOKEN } from "@common/values/token-constant";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";

import OrderSellInput from "./OrderSellInput";

const mockEstimateMaxNativeAmount = jest.fn();

jest.mock("@hooks/common/use-gnoswap-context", () => ({
  useGnoswapContext: () => ({ transactionGasService: null }),
  useOptionalGnoswapContext: () => ({
    transactionGasService: { estimateMaxNativeAmount: mockEstimateMaxNativeAmount },
  }),
}));
jest.mock("@adena-wallet/sdk", () => ({
  makeMsgCallMessage: jest.fn(),
  makeMsgSendMessage: jest.fn(),
  TransactionBuilder: jest.fn(),
}));

const renderInput = (props: Partial<React.ComponentProps<typeof OrderSellInput>> = {}) => {
  const changeAmount = jest.fn();
  const element = (overrides: Partial<React.ComponentProps<typeof OrderSellInput>> = {}) => (
    <JotaiProvider>
      <GnoswapThemeProvider>
        <OrderSellInput
          token={GNOT_TOKEN}
          amount=""
          amountUsd="-"
          balance="10"
          connectedWallet
          changeToken={jest.fn()}
          changeAmount={changeAmount}
          {...props}
          {...overrides}
        />
      </GnoswapThemeProvider>
    </JotaiProvider>
  );
  const view = render(element());

  return { changeAmount, rerender: (overrides: Partial<React.ComponentProps<typeof OrderSellInput>>) => view.rerender(element(overrides)) };
};

describe("OrderSellInput Max", () => {
  beforeEach(() => mockEstimateMaxNativeAmount.mockReset());

  it("prices native Max against the order's own messages", async () => {
    mockEstimateMaxNativeAmount.mockResolvedValue({ amount: "8500000", simulated: true });
    const makeMaxAmountMessages = jest.fn().mockResolvedValue([]);
    const { changeAmount } = renderInput({ makeMaxAmountMessages, maxAmountDependsOn: ["gno.land/r/gns", 60, 2] });

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => expect(changeAmount).toHaveBeenCalledWith("8.5"));
    expect(mockEstimateMaxNativeAmount).toHaveBeenCalledWith({ balance: "10000000", makeMessages: makeMaxAmountMessages });
  });

  it("drops an estimate priced for order terms that changed while it was out", async () => {
    let resolve: (value: { amount: string; simulated: boolean }) => void = () => undefined;
    mockEstimateMaxNativeAmount.mockReturnValue(new Promise(done => (resolve = done)));
    const makeMaxAmountMessages = jest.fn().mockResolvedValue([]);
    const { changeAmount, rerender } = renderInput({ makeMaxAmountMessages, maxAmountDependsOn: ["gno.land/r/gns", 60, 2] });

    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => expect(mockEstimateMaxNativeAmount).toHaveBeenCalled());
    // The execution count changes before the estimate comes back.
    rerender({ makeMaxAmountMessages, maxAmountDependsOn: ["gno.land/r/gns", 60, 5] });
    await act(async () => resolve({ amount: "8500000", simulated: true }));

    expect(changeAmount).not.toHaveBeenCalled();
  });

  it("waits on GNOT Max until the order terms it prices are settled", () => {
    const makeMaxAmountMessages = jest.fn().mockResolvedValue([]);
    const { rerender } = renderInput({ makeMaxAmountMessages, maxAmountReady: false });

    expect(screen.getByRole("button")).toBeDisabled();
    fireEvent.click(screen.getByRole("button"));
    expect(mockEstimateMaxNativeAmount).not.toHaveBeenCalled();

    rerender({ makeMaxAmountMessages, maxAmountReady: true });
    expect(screen.getByRole("button")).toBeEnabled();
  });
});
