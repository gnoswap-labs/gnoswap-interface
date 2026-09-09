import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { createStore, Provider } from "jotai";

import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { SwapConfirmModalState, swapConfirmModalState } from "@states/swap";
import ConfirmSwapModal from "./ConfirmSwapModal";
import { readySwapModal } from "./ConfirmSwapModal.fixture";

jest.mock("@adena-wallet/sdk", () => ({}));
jest.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key: string) => key }) }));

it("renders only ready data, blocks refetching, and passes the current quote when confirming", () => {
  const store = createStore();
  const swap = jest.fn();
  render(
    <Provider store={store}>
      <GnoswapThemeProvider>
        <ConfirmSwapModal
          submitted={false}
          swapResult={null}
          title="Confirm Swap"
          isWrapOrUnwrap={false}
          priceImpactStatus="LOW"
          isLoading={false}
          connectedWallet={false}
          setSwapRateAction={jest.fn()}
          swap={swap}
          close={jest.fn()}
        />
      </GnoswapThemeProvider>
    </Provider>,
  );
  expect(screen.queryByRole("button", { name: "Confirm Swap" })).not.toBeInTheDocument();

  act(() => store.set(swapConfirmModalState, { ...readySwapModal, isRefetching: true }));
  expect(screen.getByRole("button", { name: "Confirm Swap" })).toBeDisabled();

  act(() => store.set(swapConfirmModalState, readySwapModal));
  fireEvent.click(screen.getByRole("button", { name: "Confirm Swap" }));
  expect(swap).toHaveBeenCalledWith(readySwapModal.swapTokenInfo, "2");

  // Wrap/unwrap can be ready without a routing estimate.
  act(() => store.set(swapConfirmModalState, { ...readySwapModal, estimatedAmount: null }));
  fireEvent.click(screen.getByRole("button", { name: "Confirm Swap" }));
  expect(swap).toHaveBeenLastCalledWith(readySwapModal.swapTokenInfo, null);

  act(() => store.set(swapConfirmModalState, { status: "idle" }));
  expect(screen.queryByRole("button", { name: "Confirm Swap" })).not.toBeInTheDocument();
});

it("requires both token and summary data for the ready state at compile time", () => {
  // @ts-expect-error Ready states require all modal data.
  const incomplete: SwapConfirmModalState = { status: "ready", swapTokenInfo: readySwapModal.swapTokenInfo };
  // @ts-expect-error Ready states cannot have a null summary.
  const missingSummary: SwapConfirmModalState = { ...readySwapModal, swapSummaryInfo: null };
  expect([incomplete, missingSummary]).toHaveLength(2);
});
