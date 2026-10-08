import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider as JotaiProvider } from "jotai";

import type { PositionModel } from "@models/position/position-model";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import type { PositionSummaryResponse } from "@repositories/position/response";
import { DEVICE_TYPE } from "@styles/media";
import WalletBalanceDetail, { type WalletBalanceDetailProps } from "./WalletBalanceDetail";

const mockGetPositions = jest.fn();
let mockAddress = "wallet-a";
let mockChain = "chain-a";
jest.mock("@hooks/common/use-gnoswap-context", () => ({
  useGnoswapContext: () => ({ positionRepository: { getPositionsByAddress: mockGetPositions } }),
}));
jest.mock("@hooks/wallet/data/use-wallet", () => ({
  useWallet: () => ({ account: { address: mockAddress }, currentChainId: mockChain, availNetwork: true }),
}));
jest.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key: string) => key }) }));
jest.mock("@components/common/missing-logo/MissingLogo", () => ({ __esModule: true, default: () => null }));
jest.mock("@adena-wallet/sdk", () => ({
  makeMsgCallMessage: jest.fn(),
  makeMsgSendMessage: jest.fn(),
  TransactionBuilder: jest.fn(),
}));

const rows = (start: number, count = 1) =>
  Array.from(
    { length: count },
    (_, index) =>
      ({
        lpTokenId: `${start + index}`,
        staked: true,
        closed: false,
        stakedUsdValue: "12.5",
        stakedAt: "2026-01-01T00:00:00Z",
        tokenUri: "",
      } as PositionModel),
  );
const page = (positions = rows(1), totalCount = positions.length) => ({ positions, totalCount });
const deferred = () => {
  let resolve!: (value: { positions: PositionModel[]; totalCount: number }) => void;
  const promise = new Promise<{ positions: PositionModel[]; totalCount: number }>(done => {
    resolve = done;
  });
  return { promise, resolve };
};
const props: WalletBalanceDetailProps = {
  balanceDetailInfo: {
    availableBalance: "1",
    stakedLP: "12.5",
    unstakedLP: "0",
    claimableRewards: "0",
    totalClaimedRewards: "0",
    loadingBalance: false,
    loadingPositions: false,
    loadingRewards: false,
  },
  connected: true,
  isSwitchNetwork: false,
  claimAll: jest.fn(),
  breakpoint: DEVICE_TYPE.WEB,
  loadngTransactionClaim: false,
  positionRewards: null,
  positionSummary: { stakedCount: 45 } as PositionSummaryResponse,
  tokens: [],
  tokenPrices: {},
};
const clients: QueryClient[] = [];
const renderDetail = (overrides: Partial<WalletBalanceDetailProps> = {}) => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, cacheTime: 60_000 } } });
  clients.push(client);
  const surface = () => (
    <QueryClientProvider client={client}>
      <JotaiProvider>
        <GnoswapThemeProvider>
          <WalletBalanceDetail {...props} {...overrides} />
        </GnoswapThemeProvider>
      </JotaiProvider>
    </QueryClientProvider>
  );
  const view = render(surface());
  return { ...view, client, refresh: () => view.rerender(surface()), trigger: screen.getByText("$12.5") };
};

// JSDOM has no layout. Supply the measured Chromium reference/floating geometry
// so safePolygon receives meaningful native mouse coordinates during transfer.
const mockTooltipGeometry = () => {
  const originalRect = HTMLElement.prototype.getBoundingClientRect;
  const referenceRect: DOMRect = {
    x: 348,
    y: 276,
    width: 56,
    height: 39,
    top: 276,
    left: 348,
    right: 404,
    bottom: 315,
    toJSON: () => ({ x: 348, y: 276, width: 56, height: 39 }),
  };
  const floatingRect: DOMRect = {
    x: 226,
    y: 351,
    width: 300,
    height: 400,
    top: 351,
    left: 226,
    right: 526,
    bottom: 751,
    toJSON: () => ({ x: 226, y: 351, width: 300, height: 400 }),
  };
  jest.spyOn(document.documentElement, "clientWidth", "get").mockReturnValue(1280);
  jest.spyOn(document.documentElement, "clientHeight", "get").mockReturnValue(900);
  jest.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
    if (this.getAttribute("role") === "tooltip" || this.getAttribute("role") === "region") {
      return floatingRect;
    }
    if (this.classList.contains("base-tooltip-wrapper") || this.classList.contains("value")) {
      return referenceRect;
    }
    return originalRect.call(this);
  });
  jest.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockImplementation(function (this: HTMLElement) {
    if (this.getAttribute("role") === "tooltip") return 300;
    return this.classList.contains("base-tooltip-wrapper") ? 56 : 0;
  });
  jest.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockImplementation(function (this: HTMLElement) {
    if (this.getAttribute("role") === "tooltip") return 400;
    return this.classList.contains("base-tooltip-wrapper") ? 39 : 0;
  });
};

// Exercise the real Tooltip and infinite-query consumer together, not visibility wiring mocks.
describe("staked amount tooltip first usable data", () => {
  beforeEach(() => {
    mockGetPositions.mockReset();
    mockAddress = "wallet-a";
    mockChain = "chain-a";
    jest.spyOn(console, "error").mockImplementation(() => undefined);
    jest.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(400);
    jest.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockReturnValue(1000);
  });
  afterEach(() => {
    clients.splice(0).forEach(client => client.clear());
    jest.restoreAllMocks();
  });

  it("has no floating frame while pending, opens on response, and reopens cached rows immediately", async () => {
    const pending = deferred();
    mockGetPositions.mockReturnValue(pending.promise);
    const user = userEvent.setup();
    const view = renderDetail();
    expect(mockGetPositions).not.toHaveBeenCalled();
    await user.hover(view.trigger);
    await waitFor(() => expect(mockGetPositions).toHaveBeenCalledTimes(1));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    expect(document.querySelector("svg[data-floating-ui-arrow]")).not.toBeInTheDocument();
    await act(async () => pending.resolve(page()));
    await screen.findByText("ID #1");
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    await user.unhover(view.trigger);
    await waitFor(() => expect(screen.queryByRole("tooltip")).not.toBeInTheDocument());
    await user.hover(view.trigger);
    expect(screen.getByText("ID #1")).toBeInTheDocument();
    expect(mockGetPositions).toHaveBeenCalledTimes(1);
  });

  it("keeps shown rows usable when the pointer moves into floating content and scrolls", async () => {
    mockTooltipGeometry();
    const pending = deferred();
    mockGetPositions.mockResolvedValueOnce(page(rows(1, 20), 40)).mockReturnValueOnce(pending.promise);
    const user = userEvent.setup();
    const view = renderDetail();
    await user.pointer({ target: view.trigger, coords: { clientX: 376, clientY: 295 } });
    await screen.findByText("ID #20");
    await waitFor(() => expect(screen.getByRole("tooltip")).toHaveStyle({ visibility: "visible" }));
    const region = screen.getByRole("region");
    await user.pointer({ target: region, coords: { clientX: 340, clientY: 450 } });
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    Object.defineProperties(region, {
      scrollHeight: { configurable: true, value: 1000 },
      clientHeight: { configurable: true, value: 400 },
      scrollTop: { configurable: true, value: 600 },
    });
    fireEvent.scroll(region);
    await waitFor(() => expect(mockGetPositions).toHaveBeenCalledTimes(2));
    expect(screen.getByText("ID #1")).toBeInTheDocument();
    await act(async () => pending.resolve(page(rows(21, 20), 40)));
    await screen.findByText("ID #40");
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    expect(screen.getByText("ID #1")).toBeInTheDocument();
  });

  it("does not carry a shown floating latch into a different cached wallet scope", async () => {
    mockTooltipGeometry();
    mockGetPositions.mockResolvedValueOnce(page());
    const user = userEvent.setup();
    const view = renderDetail();
    await user.pointer({ target: view.trigger, coords: { clientX: 376, clientY: 295 } });
    await screen.findByText("ID #1");
    await waitFor(() => expect(screen.getByRole("tooltip")).toHaveStyle({ visibility: "visible" }));
    await user.pointer({ target: screen.getByRole("region"), coords: { clientX: 340, clientY: 450 } });
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    expect(screen.getByText("ID #1")).toBeInTheDocument();
    const key = [...view.client.getQueryCache().getAll()[0].queryKey];
    key[2] = "wallet-b";
    view.client.setQueryData(key, { pages: [page(rows(101))], pageParams: [1] });
    mockAddress = "wallet-b";
    view.refresh();
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    expect(screen.queryByText("ID #101")).not.toBeInTheDocument();
    expect(mockGetPositions).toHaveBeenCalledTimes(1);
    await user.pointer({ target: view.trigger, coords: { clientX: 376, clientY: 295 } });
    await screen.findByText("ID #101");
    expect(screen.queryByText("ID #1")).not.toBeInTheDocument();
  });

  it("never opens after leaving before the response", async () => {
    const pending = deferred();
    mockGetPositions.mockReturnValue(pending.promise);
    const user = userEvent.setup();
    const view = renderDetail();
    await user.hover(view.trigger);
    await user.unhover(view.trigger);
    await act(async () => pending.resolve(page()));
    await waitFor(() => expect(view.client.getQueryCache().getAll()[0].state.status).toBe("success"));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    expect(screen.queryByText("ID #1")).not.toBeInTheDocument();
  });

  it("starts on keyboard focus and does not pop open after blur", async () => {
    const pending = deferred();
    mockGetPositions.mockReturnValue(pending.promise);
    const user = userEvent.setup();
    const view = renderDetail();
    await user.tab();
    expect(view.trigger).toHaveFocus();
    await waitFor(() => expect(mockGetPositions).toHaveBeenCalledTimes(1));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    await user.tab();
    await act(async () => pending.resolve(page()));
    await waitFor(() => expect(view.client.getQueryCache().getAll()[0].state.status).toBe("success"));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("opens the first usable response while keyboard focus remains on the amount", async () => {
    const pending = deferred();
    mockGetPositions.mockReturnValue(pending.promise);
    const user = userEvent.setup();
    const view = renderDetail();
    await user.tab();
    expect(view.trigger).toHaveFocus();
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    await act(async () => pending.resolve(page()));
    await screen.findByText("ID #1");
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });

  it("closes old rows while a changed wallet or chain is pending", async () => {
    mockGetPositions.mockResolvedValueOnce(page());
    const user = userEvent.setup();
    const view = renderDetail();
    await user.hover(view.trigger);
    await screen.findByText("ID #1");
    const pending = deferred();
    mockGetPositions.mockReturnValue(pending.promise);
    mockAddress = "wallet-b";
    view.refresh();
    await waitFor(() => expect(mockGetPositions).toHaveBeenCalledWith("wallet-b", expect.anything()));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    expect(screen.queryByText("ID #1")).not.toBeInTheDocument();
    mockChain = "chain-b";
    view.refresh();
    await waitFor(() => expect(mockGetPositions).toHaveBeenCalledTimes(3));
    await act(async () => pending.resolve(page(rows(101))));
    await screen.findByText("ID #101");
    expect(screen.queryByText("ID #1")).not.toBeInTheDocument();
  });

  it("advances filtered raw pages before mounting any floating content", async () => {
    const pending = deferred();
    mockGetPositions
      .mockResolvedValueOnce(
        page(
          rows(1).map(row => ({ ...row, staked: false })),
          3,
        ),
      )
      .mockResolvedValueOnce(
        page(
          rows(2).map(row => ({ ...row, closed: true })),
          3,
        ),
      )
      .mockReturnValueOnce(pending.promise);
    const user = userEvent.setup();
    const view = renderDetail();
    await user.hover(view.trigger);
    await waitFor(() => expect(mockGetPositions.mock.calls.map(call => call[1].page)).toEqual([1, 2, 3]));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    await act(async () => pending.resolve(page(rows(3), 3)));
    await screen.findByText("ID #3");
    expect(screen.queryByText("ID #1")).not.toBeInTheDocument();
  });

  it("stops hidden filtered-page traversal on failure without a blank popup", async () => {
    mockGetPositions
      .mockResolvedValueOnce(
        page(
          rows(1).map(row => ({ ...row, closed: true })),
          3,
        ),
      )
      .mockRejectedValueOnce(new Error("offline"));
    const user = userEvent.setup();
    const view = renderDetail();
    await user.hover(view.trigger);
    await waitFor(() => expect(view.client.getQueryCache().getAll()[0].state.status).toBe("error"));
    expect(mockGetPositions.mock.calls.map(call => call[1].page)).toEqual([1, 2]);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it.each(["empty", "filtered", "error"])("never shows a blank %s response", async state => {
    if (state === "error") mockGetPositions.mockRejectedValue(new Error("offline"));
    else
      mockGetPositions.mockResolvedValue(
        state === "empty" ? page([]) : page(rows(1).map(row => ({ ...row, closed: true }))),
      );
    const user = userEvent.setup();
    const view = renderDetail();
    await user.hover(view.trigger);
    await waitFor(() =>
      expect(view.client.getQueryCache().getAll()[0].state.status).toBe(state === "error" ? "error" : "success"),
    );
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    expect(mockGetPositions).toHaveBeenCalledTimes(1);
  });

  it("does not request positions for a zero staked count", async () => {
    const user = userEvent.setup();
    const view = renderDetail({ positionSummary: { stakedCount: 0 } as PositionSummaryResponse });
    await user.hover(view.trigger);
    expect(mockGetPositions).not.toHaveBeenCalled();
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });
});
