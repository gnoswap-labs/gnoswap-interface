import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import React from "react";

import { PositionModel } from "@models/position/position-model";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import StakedPostionsTooltipContent from "./StakedPositinosTooltipContent";

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

const rows = (start: number, count: number) =>
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

const renderContent = (open = true, cacheTime = 0) => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, cacheTime } } });
  const surface = (visible: boolean) => (
    <QueryClientProvider client={client}>
      <JotaiProvider>
        <GnoswapThemeProvider>{visible && <StakedPostionsTooltipContent count={41} />}</GnoswapThemeProvider>
      </JotaiProvider>
    </QueryClientProvider>
  );
  const result = render(surface(open));
  return { ...result, client, setOpen: (visible: boolean) => result.rerender(surface(visible)) };
};

const scroll = (scrollTop: number) => {
  const surface = screen.getByRole("region");
  Object.defineProperties(surface, {
    scrollHeight: { configurable: true, value: 1000 },
    clientHeight: { configurable: true, value: 400 },
    scrollTop: { configurable: true, value: scrollTop },
  });
  fireEvent.scroll(surface);
};

describe("staked position tooltip pagination", () => {
  beforeEach(() => {
    mockGetPositions.mockReset();
    mockAddress = "wallet-a";
    mockChain = "chain-a";
    jest.spyOn(console, "error").mockImplementation(() => undefined);
    jest.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(400);
    jest.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockReturnValue(1000);
  });
  afterEach(() => jest.restoreAllMocks());

  it("fetches only after mount, only near the bottom, and stops at totalCount", async () => {
    mockGetPositions.mockImplementation((_address, { page }) =>
      Promise.resolve({
        positions: page === 1 ? rows(1, 20) : page === 2 ? rows(21, 20) : rows(41, 1),
        totalCount: 41,
      }),
    );
    const view = renderContent(false);
    expect(mockGetPositions).not.toHaveBeenCalled();
    view.setOpen(true);
    await screen.findByText("ID #20");
    expect(mockGetPositions).toHaveBeenCalledTimes(1);
    scroll(200);
    expect(mockGetPositions).toHaveBeenCalledTimes(1);
    scroll(550);
    await screen.findByText("ID #40");
    expect(mockGetPositions).toHaveBeenCalledTimes(2);
    expect(screen.getByText("ID #1")).toBeInTheDocument();
    scroll(600);
    await screen.findByText("ID #41");
    scroll(600);
    expect(mockGetPositions).toHaveBeenCalledTimes(3);
    expect(mockGetPositions).toHaveBeenLastCalledWith(
      "wallet-a",
      expect.objectContaining({
        page: 3,
        limit: 20,
        stakedOnly: true,
        withClosed: false,
      }),
    );
    view.setOpen(false);
  });

  it("preserves loaded rows on next-page failure and stops loading further pages", async () => {
    mockGetPositions
      .mockResolvedValueOnce({ positions: rows(1, 20), totalCount: 40 })
      .mockRejectedValueOnce(new Error("offline"));
    const view = renderContent();
    await screen.findByText("ID #20");
    scroll(600);
    await waitFor(() => expect(view.client.getQueryCache().getAll()[0].state.error).toEqual(new Error("offline")));
    expect(screen.getByText("ID #1")).toBeInTheDocument();
    scroll(600);
    expect(mockGetPositions.mock.calls.map(call => call[1].page)).toEqual([1, 2]);
  });

  it("reloads the first page after a closed tooltip is invalidated by a position mutation", async () => {
    mockGetPositions.mockResolvedValueOnce({ positions: rows(1, 20), totalCount: 20 });
    const view = renderContent(true, 60_000);
    await screen.findByText("ID #1");
    view.setOpen(false);
    await view.client.invalidateQueries();
    mockGetPositions.mockResolvedValueOnce({ positions: rows(101, 20), totalCount: 20 });
    view.setOpen(true);
    try {
      await screen.findByText("ID #101");
      expect(screen.queryByText("ID #1")).not.toBeInTheDocument();
      expect(mockGetPositions.mock.calls.map(call => call[1].page)).toEqual([1, 1]);
    } finally {
      view.client.clear();
    }
  });

  it("does not show the previous wallet or chain rows while the new request is pending", async () => {
    mockGetPositions.mockResolvedValueOnce({ positions: rows(1, 20), totalCount: 20 });
    const view = renderContent();
    await screen.findByText("ID #1");
    mockGetPositions.mockImplementation(() => new Promise(() => {}));
    mockAddress = "wallet-b";
    view.setOpen(true);
    await waitFor(() => expect(mockGetPositions).toHaveBeenCalledWith("wallet-b", expect.anything()));
    expect(screen.queryByText("ID #1")).not.toBeInTheDocument();
    mockChain = "chain-b";
    view.setOpen(true);
    await waitFor(() => expect(mockGetPositions).toHaveBeenCalledTimes(3));
  });

  it("hides unstaked and closed positions even when the API ignores the filters", async () => {
    const [openStaked, unstaked, closedStaked] = rows(1, 3);
    mockGetPositions.mockResolvedValue({
      positions: [openStaked, { ...unstaked, staked: false }, { ...closedStaked, closed: true }],
      totalCount: 3,
    });
    renderContent();
    await screen.findByText("ID #1");
    expect(screen.queryByText("ID #2")).not.toBeInTheDocument();
    expect(screen.queryByText("ID #3")).not.toBeInTheDocument();
  });

  it("loads short pages without scrolling until the content overflows", async () => {
    jest.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockImplementation(function (this: HTMLElement) {
      return this.textContent?.includes("ID #3") ? 500 : 200;
    });
    mockGetPositions.mockImplementation((_address, { page }) =>
      Promise.resolve({ positions: rows(page, 1), totalCount: 4 }),
    );
    renderContent();
    await screen.findByText("ID #3");
    expect(screen.getByText("ID #1")).toBeInTheDocument();
    expect(screen.getByText("ID #2")).toBeInTheDocument();
    expect(screen.queryByText("ID #4")).not.toBeInTheDocument();
    expect(mockGetPositions.mock.calls.map(call => call[1].page)).toEqual([1, 2, 3]);
  });

  it("continues past filtered pages and stops automatic loading on an error", async () => {
    jest.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockReturnValue(200);
    mockGetPositions
      .mockResolvedValueOnce({ positions: rows(1, 1).map(position => ({ ...position, staked: false })), totalCount: 3 })
      .mockResolvedValueOnce({ positions: rows(2, 1).map(position => ({ ...position, closed: true })), totalCount: 3 })
      .mockRejectedValueOnce(new Error("offline"));
    const view = renderContent();
    await waitFor(() => expect(view.client.getQueryCache().getAll()[0].state.error).toEqual(new Error("offline")));
    expect(screen.queryByText("ID #1")).not.toBeInTheDocument();
    expect(screen.queryByText("ID #2")).not.toBeInTheDocument();
    expect(mockGetPositions.mock.calls.map(call => call[1].page)).toEqual([1, 2, 3]);
  });
});
