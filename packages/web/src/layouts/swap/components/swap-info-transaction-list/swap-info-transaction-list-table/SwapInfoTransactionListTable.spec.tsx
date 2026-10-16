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
