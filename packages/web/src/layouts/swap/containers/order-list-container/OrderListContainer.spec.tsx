import { fireEvent, render, screen } from "@testing-library/react";

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
jest.mock("../../components/order-list/order-card/DcaOrderItemCard", () => ({
  __esModule: true,
  default: ({ order }: { order: { packagePath: string; orderId: string } }) => (
    <div data-testid="order-card">{`${order.packagePath}:${order.orderId}`}</div>
  ),
}));
jest.mock("../../components/order-list/order-card/LimitOrderItemCard", () => ({
  __esModule: true,
  default: ({ order }: { order: { packagePath: string; orderId: string } }) => (
    <div data-testid="order-card">{`${order.packagePath}:${order.orderId}`}</div>
  ),
}));

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

  it("opens the first page of the other tab, never its page of the previous tab", () => {
    const requests: { status: string; page: number; size: number }[] = [];
    mockUseWallet.mockReturnValue({ connected: true, account: { address: "g1owner" } });
    mockUseGetDcaOrders.mockReturnValue({ data: undefined, isLoading: true });
    mockUseGetLimitOrders.mockImplementation((request: { status: string; page: number; size: number }) => {
      requests.push(request);
      return {
        data: { items: [], pageInfo: { currentPage: request.page, totalItems: 20, totalPages: 2 } },
        isLoading: false,
      };
    });
    render(
      <GnoswapThemeProvider>
        <OrderListContainer kind="limit" />
      </GnoswapThemeProvider>,
    );

    fireEvent.click(screen.getByText("Swap:order.past"));
    fireEvent.click(screen.getByRole("button", { name: "2" }));
    requests.length = 0;
    fireEvent.click(screen.getByText("Swap:order.active"));

    const pages = requests.filter(request => request.size > 1);
    expect(pages.length).toBeGreaterThan(0);
    expect(pages.every(request => request.status === "active" && request.page === 1)).toBe(true);
  });

  it("refetches the opened tab's list even when it is cached", () => {
    renderContainer("limit", { active: 1, past: 0 });

    const listOptions = mockUseGetLimitOrders.mock.calls
      .filter(([request]) => request.size > 1)
      .map(([, options]) => options);
    expect(listOptions.length).toBeGreaterThan(0);
    expect(listOptions.every(options => options.refetchOnMount === "always")).toBe(true);
  });

  it.each(["active", "past"] as const)(
    "polls the visible %s list as often as the swap history, and not the hidden kind",
    tab => {
      renderContainer("limit", { active: 1, past: 1 });
      if (tab === "past") fireEvent.click(screen.getByText("Swap:order.past"));

      const lastListCall = (mock: jest.Mock) => mock.mock.calls.filter(([request]) => request.size > 1).pop();
      expect(lastListCall(mockUseGetLimitOrders)?.[0].status).toBe(tab);
      expect(lastListCall(mockUseGetLimitOrders)?.[1].refetchInterval).toBe(5_000);
      expect(lastListCall(mockUseGetDcaOrders)?.[1].refetchInterval).toBe(false);
    },
  );

  it.each(["dca", "limit"] as const)("keys %s cards by realm and order ID", kind => {
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => undefined);
    const items = [
      { orderId: "1", packagePath: "gno.land/r/gnoswap/test/order/" + kind },
      { orderId: "1", packagePath: "gno.land/r/gnoswap/test3/order/" + kind },
    ];
    const page = { data: { items, pageInfo: { currentPage: 1, totalItems: 2, totalPages: 1 } }, isLoading: false };
    mockUseWallet.mockReturnValue({ connected: true, account: { address: "g1owner" } });
    const mockOrders = kind === "dca" ? mockUseGetDcaOrders : mockUseGetLimitOrders;
    const mockOther = kind === "dca" ? mockUseGetLimitOrders : mockUseGetDcaOrders;
    mockOrders.mockReturnValue(page);
    mockOther.mockReturnValue({ data: undefined, isLoading: true });

    render(
      <GnoswapThemeProvider>
        <OrderListContainer kind={kind} />
      </GnoswapThemeProvider>,
    );

    expect(screen.getAllByTestId("order-card")).toHaveLength(2);
    const duplicateKeyWarnings = consoleError.mock.calls.filter(args => String(args[0]).includes("same key"));
    consoleError.mockRestore();
    expect(duplicateKeyWarnings).toHaveLength(0);
  });
});
