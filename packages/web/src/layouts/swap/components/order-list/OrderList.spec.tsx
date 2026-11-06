import { fireEvent, render, screen } from "@testing-library/react";

import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";

import OrderList, { OrderListProps } from "./OrderList";

const renderList = (props: Partial<OrderListProps> = {}) =>
  render(
    <GnoswapThemeProvider>
      <OrderList
        tab="active"
        changeTab={jest.fn()}
        connectedWallet={true}
        isLoading={false}
        isEmpty={false}
        currentPage={1}
        totalPages={1}
        changePage={jest.fn()}
        {...props}
      >
        <div>order card</div>
      </OrderList>
    </GnoswapThemeProvider>,
  );

describe("OrderList", () => {
  it("keeps the tabs and asks to connect a wallet when none is connected", () => {
    renderList({ connectedWallet: false });

    const [openTab, pastTab] = screen.getAllByRole("button");
    expect(openTab).toBeDisabled();
    expect(pastTab).toBeEnabled();
    expect(screen.getByText("Swap:order.connectWallet")).toBeInTheDocument();
    expect(screen.queryByText("order card")).not.toBeInTheDocument();
  });

  it("renders the order cards when connected", () => {
    renderList();
    expect(screen.getByText("order card")).toBeInTheDocument();
  });

  it("shows the empty state", () => {
    renderList({ isEmpty: true });
    expect(screen.getByText("Swap:order.noOrders")).toBeInTheDocument();
  });

  it("switches between open and past orders", () => {
    const changeTab = jest.fn();
    renderList({ changeTab });

    fireEvent.click(screen.getAllByRole("button").find(button => !button.hasAttribute("disabled"))!);
    expect(changeTab).toHaveBeenCalledWith("past");
  });
});
