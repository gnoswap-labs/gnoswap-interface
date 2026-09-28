import { render, screen } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";

import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";

import ConfirmSwapModal from "./ConfirmSwapModal";

jest.mock("@adena-wallet/sdk", () => ({
  makeMsgCallMessage: jest.fn(),
  makeMsgSendMessage: jest.fn(),
  TransactionBuilder: jest.fn(),
}));

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
});
