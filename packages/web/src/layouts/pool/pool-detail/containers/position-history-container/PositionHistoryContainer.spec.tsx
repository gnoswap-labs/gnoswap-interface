import { ThemeProvider } from "@emotion/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";

import { PoolPositionModel } from "@models/position/pool-position-model";
import { IPositionHistoryModel } from "@models/position/position-history-model";
import { DexEvent } from "@repositories/common";
import { GetPositionHistoryResult } from "@repositories/position/response";
import { getTheme } from "@utils/theme-utils";

import PositionHistoryContainer from "./PositionHistoryContainer";

const getPositionHistory = jest.fn();

jest.mock("@hooks/common/use-gnoswap-context", () => ({
  useGnoswapContext: () => ({ positionRepository: { getPositionHistory } }),
}));
jest.mock("@hooks/common/use-loading", () => ({ useLoading: () => ({ isLoading: false }) }));
jest.mock("@hooks/common/use-window-size", () => ({
  useWindowSize: () => ({ breakpoint: "web" }),
}));
jest.mock("../../components/position-history-list/position-history-table/PositionHistoryTable", () => ({
  __esModule: true,
  default: ({ list, isLoading }: { list: IPositionHistoryModel[]; isLoading: boolean }) => (
    <div>{isLoading ? "Loading history" : list.map(item => <span key={item.txHash}>{item.txHash}</span>)}</div>
  ),
}));

const position = (lpTokenId: string) =>
  ({ lpTokenId, pool: { tokenA: { decimals: 6 }, tokenB: { decimals: 6 } } }) as PoolPositionModel;

const history = (txHash: string, amountA = 1_000_000): IPositionHistoryModel => ({
  txHash,
  time: "2026-10-01T00:00:00Z",
  type: DexEvent.ADD,
  tokenASymbol: "A",
  tokenBSymbol: "B",
  amountA,
  amountB: 0,
  usdValue: 1,
});

const renderHistory = (lpTokenId = "42") => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } } });
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>
      <ThemeProvider theme={getTheme("dark")}>{children}</ThemeProvider>
    </QueryClientProvider>
  );
  return render(<PositionHistoryContainer position={position(lpTokenId)} />, { wrapper });
};

const nextButton = () => screen.getAllByRole("button").slice(-1)[0];
const previousButton = () => screen.getAllByRole("button")[0];

describe("PositionHistoryContainer pagination", () => {
  beforeEach(() => getPositionHistory.mockReset());

  it.each([21, 41])("keeps all %i history entries reachable even when a page has only zero-amount entries", async totalCount => {
    getPositionHistory.mockImplementation((_id: string, page: number) =>
      Promise.resolve({
        history: page === 1 ? Array.from({ length: 20 }, (_, i) => history(`zero-${i}`, 0)) : [history(`page-${page}`)],
        totalCount,
      }),
    );
    renderHistory();

    await waitFor(() => expect(nextButton()).not.toBeDisabled());
    expect(screen.queryByText("zero-0")).not.toBeInTheDocument();
    fireEvent.click(nextButton());
    await screen.findByText("page-2");
    expect(getPositionHistory).toHaveBeenLastCalledWith("42", 2, 20);
    if (totalCount === 41) {
      fireEvent.click(nextButton());
      await screen.findByText("page-3");
      expect(getPositionHistory).toHaveBeenLastCalledWith("42", 3, 20);
    }
    expect(nextButton()).toBeDisabled();
    fireEvent.click(previousButton());
    await waitFor(() => expect(getPositionHistory).toHaveBeenLastCalledWith("42", totalCount === 41 ? 2 : 1, 20));
  });

  it("disables navigation during a page request and resets without showing another position's rows", async () => {
    let resolvePage!: (result: GetPositionHistoryResult) => void;
    let resolvePosition!: (result: GetPositionHistoryResult) => void;
    getPositionHistory
      .mockResolvedValueOnce({ history: [history("position-42-page-1")], totalCount: 41 })
      .mockImplementationOnce(
        () =>
          new Promise<GetPositionHistoryResult>(resolve => {
            resolvePage = resolve;
          }),
      )
      .mockImplementationOnce(
        () =>
          new Promise<GetPositionHistoryResult>(resolve => {
            resolvePosition = resolve;
          }),
      );
    const { rerender } = renderHistory();

    await screen.findByText("position-42-page-1");
    fireEvent.click(nextButton());
    await waitFor(() => screen.getAllByRole("button").forEach(button => expect(button).toBeDisabled()));
    expect(screen.queryByText("position-42-page-1")).not.toBeInTheDocument();
    await act(async () => resolvePage({ history: [history("position-42-page-2")], totalCount: 41 }));
    await screen.findByText("position-42-page-2");

    rerender(<PositionHistoryContainer position={position("43")} />);
    expect(screen.queryByText("position-42-page-2")).not.toBeInTheDocument();
    await waitFor(() => expect(getPositionHistory).toHaveBeenLastCalledWith("43", 1, 20));
    await act(async () => resolvePosition({ history: [history("position-43-page-1")], totalCount: 21 }));
    await screen.findByText("position-43-page-1");
    expect(previousButton()).toBeDisabled();
    expect(nextButton()).not.toBeDisabled();
  });

  it.each([0, 20])("hides pagination for %i total entries", async totalCount => {
    getPositionHistory.mockResolvedValue({ history: totalCount ? [history("single-page")] : [], totalCount });
    renderHistory();
    await waitFor(() => expect(screen.queryByText("Loading history")).not.toBeInTheDocument());
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
