import { fireEvent, render, screen } from "@testing-library/react";

import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { LimitMarketPriceProvider } from "@providers/limit-market-price-provider/LimitMarketPriceProvider";
import type { LimitMarketPricePair } from "@repositories/order/request";
import { canonicalizeLimitMarketPricePairs, getLimitMarketPricePairKey } from "@utils/limit-market-price-utils";

import { hasAnyOrder, OrderListContainer } from "./OrderListContainer";

const mockUseWallet = jest.fn();
const mockUseGetDcaOrders = jest.fn();
const mockUseGetLimitOrders = jest.fn();
const mockUseGetLimitMarketPrices = jest.fn();

jest.mock("@hooks/wallet/data/use-wallet", () => ({ useWallet: () => mockUseWallet() }));
jest.mock("@hooks/common/use-window-size", () => ({
  useWindowSize: () => ({ isMobile: false, handleBreakpoint: jest.fn() }),
}));
jest.mock("@hooks/common/use-gnoscan-url", () => ({ useGnoscanUrl: () => ({ getTxUrl: (hash: string) => hash }) }));
jest.mock("@hooks/order/data/use-order-token-usd-price", () => ({ useOrderTokenUsdPrice: () => () => null }));
jest.mock("@hooks/order/data/use-stop-order-handler", () => ({
  useStopOrderHandler: () => ({
    openStopDcaOrder: jest.fn(),
    openCancelLimitOrder: jest.fn(),
    claimDcaOrder: jest.fn(),
  }),
}));
jest.mock("@query/order", () => ({
  useGetDcaOrders: (...args: unknown[]) => mockUseGetDcaOrders(...args),
  useGetLimitOrders: (...args: unknown[]) => mockUseGetLimitOrders(...args),
}));
jest.mock("@query/order/use-get-limit-market-prices", () => ({
  useGetLimitMarketPrices: (...args: unknown[]) => mockUseGetLimitMarketPrices(...args),
}));
jest.mock("@hooks/common/use-custom-router", () => ({
  __esModule: true,
  default: () => ({ query: { type: "limit" } }),
}));
jest.mock("@constants/order.constant", () => ({ ENABLED_SWAP_CARD_TYPES: ["swap", "dca", "limit"] }));
jest.mock("../../components/order-list/order-card/DcaOrderItemCard", () => ({
  __esModule: true,
  default: ({ order }: { order: { packagePath: string; orderId: string } }) => (
    <div data-testid="order-card">{`${order.packagePath}:${order.orderId}`}</div>
  ),
}));
type MockLimitCardProps = { order: { packagePath: string; orderId: string }; marketPrice: string | null };
jest.mock("../../components/order-list/order-card/LimitOrderItemCard", () => ({
  __esModule: true,
  default: ({ order, marketPrice }: MockLimitCardProps) => (
    <div data-testid="order-card">{`${order.packagePath}:${order.orderId} ${marketPrice ?? "-"}`}</div>
  ),
}));

beforeEach(() => {
  mockUseGetLimitMarketPrices.mockReset().mockReturnValue({ data: undefined, isError: false });
});

type Totals = { active?: number; past?: number };

// Each request is answered from the totals of its tab; a one-item page is a total lookup.
const answer = (totals: Totals) => (request: { status: "active" | "past" }, options?: { enabled?: boolean }) => {
  const total = totals[request.status];
  if (options?.enabled === false || total === undefined) return { data: undefined, isLoading: true };

  return {
    data: { items: [], pageInfo: { currentPage: 1, totalItems: total, totalPages: total ? 1 : 0 } },
    isLoading: false,
  };
};

const renderContainer = (kind: "dca" | "limit", totals: Totals, connected = true) => {
  mockUseWallet.mockReturnValue({ connected, account: connected ? { address: "g1owner" } : null });
  mockUseGetDcaOrders.mockImplementation(answer(kind === "dca" ? totals : {}));
  mockUseGetLimitOrders.mockImplementation(answer(kind === "limit" ? totals : {}));

  return render(
    <GnoswapThemeProvider>
      <OrderListContainer kind={kind} />
    </GnoswapThemeProvider>,
    { wrapper: LimitMarketPriceProvider },
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
    ["dca", "an active order", { active: 1, past: 0 }],
    ["dca", "only past orders", { active: 0, past: 2 }],
    ["limit", "an active order", { active: 1, past: 0 }],
    ["limit", "only past orders", { active: 0, past: 2 }],
  ] as const)("keeps the %s list with its tabs when the account has %s", (kind, _, totals) => {
    renderContainer(kind, totals);

    expect(screen.getByText("Swap:order.active")).toBeInTheDocument();
    expect(screen.getByText("Swap:order.past")).toBeInTheDocument();
  });

  it.each(["dca", "limit"] as const)("shows no %s list without a wallet", kind => {
    const { container } = renderContainer(kind, {}, false);

    expect(container).toBeEmptyDOMElement();
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
      { wrapper: LimitMarketPriceProvider },
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
    const pair = { tokenIn: { path: "gno.land/r/demo/a" }, tokenOut: { path: "gno.land/r/demo/b" } };
    const items = [
      { orderId: "1", packagePath: "gno.land/r/gnoswap/test/order/" + kind, ...pair },
      { orderId: "1", packagePath: "gno.land/r/gnoswap/test3/order/" + kind, ...pair },
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
      { wrapper: LimitMarketPriceProvider },
    );

    expect(screen.getAllByTestId("order-card")).toHaveLength(2);
    const duplicateKeyWarnings = consoleError.mock.calls.filter(args => String(args[0]).includes("same key"));
    consoleError.mockRestore();
    expect(duplicateKeyWarnings).toHaveLength(0);
  });

  it.each(["dca", "limit"] as const)("returns a %s list to its last page when the open page runs past it", kind => {
    const requests: { page: number; size: number }[] = [];
    let remaining = 11;
    mockUseWallet.mockReturnValue({ connected: true, account: { address: "g1owner" } });
    const mockOrders = kind === "dca" ? mockUseGetDcaOrders : mockUseGetLimitOrders;
    const mockOther = kind === "dca" ? mockUseGetLimitOrders : mockUseGetDcaOrders;
    mockOther.mockReturnValue({ data: undefined, isLoading: true });
    mockOrders.mockImplementation((request: { page: number; size: number }) => {
      requests.push(request);
      const pages = remaining === 11 ? 2 : 1;
      return {
        data: { items: [], pageInfo: { currentPage: request.page, totalItems: remaining, totalPages: pages } },
        isLoading: false,
        isPreviousData: false,
      };
    });
    const view = () => (
      <GnoswapThemeProvider>
        <OrderListContainer kind={kind} />
      </GnoswapThemeProvider>
    );
    const { rerender } = render(view(), { wrapper: LimitMarketPriceProvider });
    fireEvent.click(screen.getByRole("button", { name: "2" }));

    // The last order of page 2 leaves the list.
    remaining = 10;
    requests.length = 0;
    rerender(view());

    const lastListRequest = requests.filter(request => request.size > 1).pop();
    expect(lastListRequest?.page).toBe(1);
  });
});

describe("OrderListContainer market prices", () => {
  const tokenA = { path: "gno.land/r/demo/a" };
  const tokenB = { path: "gno.land/r/demo/b" };
  const tokenC = { path: "gno.land/r/demo/c" };
  /** Pool spot rates by directed pair; a pair's rate never answers its reverse. */
  const SPOT_RATES: [LimitMarketPricePair, string][] = [
    [{ tokenIn: tokenA.path, tokenOut: tokenB.path }, "0.25"],
    [{ tokenIn: tokenB.path, tokenOut: tokenA.path }, "4"],
    [{ tokenIn: tokenC.path, tokenOut: tokenA.path }, "0.5"],
  ];

  const order = (orderId: string, tokenIn: { path: string }, tokenOut: { path: string }, makingAmount = "1") => ({
    orderId,
    packagePath: "gno.land/r/gnoswap/limit",
    tokenIn,
    tokenOut,
    makingAmount,
  });

  /** The pairs of the latest shared market price query. */
  const requestedPairs = () => {
    const { calls } = mockUseGetLimitMarketPrices.mock;
    return canonicalizeLimitMarketPricePairs(calls[calls.length - 1]?.[0] ?? []);
  };
  const view = () => (
    <GnoswapThemeProvider>
      <OrderListContainer kind="limit" />
    </GnoswapThemeProvider>
  );

  const renderPages = (pages: unknown[][]) => {
    mockUseWallet.mockReturnValue({ connected: true, account: { address: "g1owner" } });
    mockUseGetDcaOrders.mockReturnValue({ data: undefined, isLoading: true });
    mockUseGetLimitOrders.mockImplementation((request: { page: number; size: number }) => ({
      data: {
        items: request.size > 1 ? (pages[request.page - 1] ?? []) : [],
        pageInfo: { currentPage: request.page, totalItems: pages.flat().length, totalPages: pages.length },
      },
      isLoading: false,
      isPreviousData: false,
    }));
    return render(view(), { wrapper: LimitMarketPriceProvider });
  };

  beforeEach(() => {
    const rates = new Map(SPOT_RATES.map(([pair, rate]) => [getLimitMarketPricePairKey(pair), rate]));
    const pool = { poolPath: "gno.land/r/gnoswap/pool", updatedBlockHeight: 1, updatedBlockTime: 1 };
    mockUseGetLimitMarketPrices.mockImplementation((pairs: LimitMarketPricePair[]) => ({
      data: Object.fromEntries(
        pairs.map(pair => {
          const outputPerInput = rates.get(getLimitMarketPricePairKey(pair));
          return [getLimitMarketPricePairKey(pair), outputPerInput ? { ...pool, outputPerInput } : null];
        }),
      ),
      isError: false,
    }));
  });

  it("asks for the opened page's pairs instead of the previous page's", () => {
    renderPages([[order("1", tokenA, tokenB)], [order("2", tokenC, tokenA)]]);
    fireEvent.click(screen.getByRole("button", { name: "2" }));

    expect(requestedPairs()).toEqual([{ tokenIn: tokenC.path, tokenOut: tokenA.path }]);
  });

  it("stops pricing the orders once the list closes", () => {
    const { rerender } = renderPages([[order("1", tokenA, tokenB)]]);
    mockUseWallet.mockReturnValue({ connected: false, account: null });
    rerender(view());

    expect(requestedPairs()).toEqual([]);
  });
});
