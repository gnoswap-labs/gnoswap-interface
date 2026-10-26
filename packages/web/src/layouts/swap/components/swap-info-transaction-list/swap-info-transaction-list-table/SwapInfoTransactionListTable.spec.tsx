import { fireEvent, render, screen } from "@testing-library/react";

import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { SwapHistoryItem } from "@repositories/swap/response/swap-history-response";
import { DEVICE_TYPE } from "@styles/media";

import SwapInfoTransactionListTable from "./SwapInfoTransactionListTable";
import { mockSwapHistory } from "./__mock__/mock-swap-info-transaction";

// The container module pulls in the wallet SDK, only its table headers are needed here
jest.mock("@layouts/swap/containers/swap-info-transaction-list-container/SwapInfoTransactionListContainer", () => ({
  TABLE_HEAD: { TIME: "time", VALUE: "value", Swap: "swap" },
  MOBILE_TABLE_HEAD: { TIME: "time", Swap: "swap" },
}));

jest.mock("@hooks/common/use-gnoscan-url", () => ({
  __esModule: true,
  useGnoscanUrl: () => ({ getTxUrl: (hash: string) => `https://gnoscan.io/tx/${hash}` }),
}));

jest.mock("@hooks/token/data/use-token-image", () => ({
  __esModule: true,
  useTokenImage: () => ({ getTokenImage: () => null }),
}));

const tx = (txHash: string): SwapHistoryItem => ({ ...mockSwapHistory[0], txHash });

const highlightedHashes = (container: HTMLElement) =>
  Array.from(container.querySelectorAll(".highlight a")).map(a => a.getAttribute("href")?.split("/").pop());

const renderedHashes = (container: HTMLElement) =>
  Array.from(container.querySelectorAll("a")).map(a => a.getAttribute("href")?.split("/").pop());

describe("SwapInfoTransactionListTable", () => {
  it.each([
    [DEVICE_TYPE.WEB, 9],
    [DEVICE_TYPE.MOBILE, 7],
  ])("keeps navigation stable and shows the correct ten swaps on %s", (breakpoint, controlCount) => {
    const history = Array.from({ length: 100 }, (_, i) => tx(`tx${i}`));
    const { container } = render(
      <GnoswapThemeProvider>
        <SwapInfoTransactionListTable breakpoint={breakpoint} swapHistory={history} />
      </GnoswapThemeProvider>,
    );
    const expectPage = (page: number) => {
      expect(renderedHashes(container)).toEqual(history.slice((page - 1) * 10, page * 10).map(item => item.txHash));
      expect(screen.getAllByRole("button")).toHaveLength(controlCount);
      expect(screen.getByRole("button", { name: String(page) })).toHaveClass("selected");
    };
    for (let page = 1; page <= 10; page++) {
      expectPage(page);
      const buttons = screen.getAllByRole("button");
      expect(buttons[0]).toHaveProperty("disabled", page === 1);
      expect(buttons[buttons.length - 1]).toHaveProperty("disabled", page === 10);
      if (page < 10) fireEvent.click(buttons[buttons.length - 1]);
    }
    expect(screen.getAllByRole("button").at(-1)).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "1" }));
    expectPage(1);
    expect(screen.getAllByRole("button")[0]).toBeDisabled();
  });

  it("keeps later pages fixed while new swaps arrive and shows them again on page 1", () => {
    const view = (swapHistory: SwapHistoryItem[]) => (
      <GnoswapThemeProvider>
        <SwapInfoTransactionListTable breakpoint={DEVICE_TYPE.WEB} swapHistory={swapHistory} />
      </GnoswapThemeProvider>
    );
    const initial = Array.from({ length: 15 }, (_, i) => tx(`tx${i}`));

    const { container, rerender } = render(view(initial));
    fireEvent.click(screen.getByRole("button", { name: "2" }));
    expect(renderedHashes(container)).toEqual(["tx10", "tx11", "tx12", "tx13", "tx14"]);

    rerender(view([tx("new"), ...initial]));
    expect(renderedHashes(container)).toEqual(["tx10", "tx11", "tx12", "tx13", "tx14"]);

    fireEvent.click(screen.getByRole("button", { name: "1" }));
    expect(renderedHashes(container)[0]).toBe("new");
  });

  it("highlights only transactions that arrived since the last update", () => {
    const view = (swapHistory: SwapHistoryItem[]) => (
      <GnoswapThemeProvider>
        <SwapInfoTransactionListTable breakpoint={DEVICE_TYPE.WEB} swapHistory={swapHistory} />
      </GnoswapThemeProvider>
    );

    const { container, rerender } = render(view([tx("old")]));
    expect(highlightedHashes(container)).toEqual([]);

    rerender(view([tx("new1"), tx("old")]));
    expect(highlightedHashes(container)).toEqual(["new1"]);

    rerender(view([tx("new2"), tx("new1"), tx("old")]));
    expect(highlightedHashes(container)).toEqual(["new2"]);
  });
});
