import { render, screen } from "@testing-library/react";

import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";

import { hasAnyOrder, OrderListContainer } from "./OrderListContainer";

const mockUseWallet = jest.fn();
const mockUseGetDcaOrders = jest.fn();
const mockUseGetLimitOrders = jest.fn();

jest.mock("@hooks/wallet/data/use-wallet", () => ({ useWallet: () => mockUseWallet() }));
jest.mock("@hooks/common/use-window-size", () => ({
  useWindowSize: () => ({ isMobile: false, handleBreakpoint: jest.fn() }),
}));
jest.mock("@hooks/common/use-gnoscan-url", () => ({ useGnoscanUrl: () => ({ getTxUrl: (hash: string) => hash }) }));
jest.mock("@hooks/order/data/use-stop-order-handler", () => ({
  useStopOrderHandler: () => ({ openStopDcaOrder: jest.fn(), openCancelLimitOrder: jest.fn(), claimDcaOrder: jest.fn() }),
}));
jest.mock("@query/order", () => ({
  useGetDcaOrders: (...args: unknown[]) => mockUseGetDcaOrders(...args),
  useGetLimitOrders: (...args: unknown[]) => mockUseGetLimitOrders(...args),
}));
jest.mock("@constants/order.constant", () => ({ ENABLED_SWAP_CARD_TYPES: ["swap", "dca", "limit"] }));

type Totals = { active?: number; past?: number };

// Each request is answered from the totals of its tab; a one-item page is a total lookup.
const answer =
  (totals: Totals) =>
  (request: { status: "active" | "past" }, options?: { enabled?: boolean }) => {
    const total = totals[request.status];
    if (options?.enabled === false || total === undefined) return { data: undefined, isLoading: true };

    return { data: { items: [], pageInfo: { currentPage: 1, totalItems: total, totalPages: total ? 1 : 0 } }, isLoading: false };
  };

const renderContainer = (kind: "dca" | "limit", totals: Totals, connected = true) => {
  mockUseWallet.mockReturnValue({ connected, account: connected ? { address: "g1owner" } : null });
  mockUseGetDcaOrders.mockImplementation(answer(kind === "dca" ? totals : {}));
  mockUseGetLimitOrders.mockImplementation(answer(kind === "limit" ? totals : {}));

  return render(
    <GnoswapThemeProvider>
      <OrderListContainer kind={kind} />
    </GnoswapThemeProvider>,
  );
};

describe("hasAnyOrder", () => {
  it("is unknown until both totals load", () => {
    expect(hasAnyOrder(undefined, 0)).toBeUndefined();
    expect(hasAnyOrder(0, undefined)).toBeUndefined();
  });

  it("is true when either tab has an order", () => {
    expect(hasAnyOrder(0, 0)).toBe(false);
    expect(hasAnyOrder(1, 0)).toBe(true);
    expect(hasAnyOrder(0, 3)).toBe(true);
  });
});

describe("OrderListContainer", () => {
  it.each(["dca", "limit"] as const)("shows no %s list when the account has no active or past order", kind => {
    const { container } = renderContainer(kind, { active: 0, past: 0 });

    expect(container).toBeEmptyDOMElement();
  });

  it("shows no list while the totals are loading", () => {
    const { container } = renderContainer("dca", { active: 0 });

    expect(container).toBeEmptyDOMElement();
  });

  it.each([
    ["an active order", { active: 1, past: 0 }],
    ["only past orders", { active: 0, past: 2 }],
  ])("keeps the list with its tabs when the account has %s", (_, totals) => {
    renderContainer("dca", totals);

    expect(screen.getByText("Swap:order.active")).toBeInTheDocument();
    expect(screen.getByText("Swap:order.past")).toBeInTheDocument();
  });

  it("keeps the connect-wallet prompt without a wallet", () => {
    renderContainer("dca", {}, false);

    expect(screen.getByText("Swap:order.connectWallet")).toBeInTheDocument();
  });
});
