import { fireEvent, render, screen } from "@testing-library/react";

import { OrderHistoryModel } from "@models/order/order-type";
import { TokenModel } from "@models/token/token-model";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";

import OrderHistoryTable, { formatHistoryTime } from "./OrderHistoryTable";

jest.mock("@hooks/common/use-gnoscan-url", () => ({
  __esModule: true,
  useGnoscanUrl: () => ({ getTxUrl: (hash: string) => `https://gnoscan.io/tx/${hash}` }),
}));

const token = (symbol: string): TokenModel => ({
  type: "GRC20",
  chainId: "",
  createdAt: "",
  name: symbol,
  path: `gno.land/r/demo/${symbol.toLowerCase()}`,
  decimals: 6,
  symbol,
  displaySymbol: symbol,
  logoURI: "",
  priceID: symbol,
});

const NOW = 1_793_664_000;

const row = (index: number, overrides: Partial<OrderHistoryModel> = {}): OrderHistoryModel => ({
  key: `row-${index}`,
  txHash: `tx${index}`,
  time: NOW - 600,
  rate: "1.1514379",
  soldAmount: "165.159",
  purchasedAmount: "152.1599",
  ...overrides,
});

const renderTable = (props: Partial<React.ComponentProps<typeof OrderHistoryTable>> = {}) =>
  render(
    <GnoswapThemeProvider>
      <OrderHistoryTable
        kind="dca"
        items={[row(1)]}
        inputToken={token("GNS")}
        outputToken={token("GNOT")}
        currentPage={1}
        totalPages={1}
        changePage={jest.fn()}
        {...props}
      />
    </GnoswapThemeProvider>,
  );

describe("OrderHistoryTable", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(NOW * 1000);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("preserves exchange-rate precision and token precision in history amounts", () => {
    renderTable();

    expect(screen.getByText("10m ago")).toBeInTheDocument();
    expect(screen.getByText("1.151437")).toBeInTheDocument();
    expect(screen.getByText("165.159")).toBeInTheDocument();
    expect(screen.getByText("152.1599")).toBeInTheDocument();
  });

  it("preserves small DCA rates and shows unabridged historical amounts", () => {
    renderTable({ items: [row(1, { rate: "0.004", soldAmount: "12500", purchasedAmount: "2500000" })] });

    expect(screen.getByText("0.004")).toBeInTheDocument();
    expect(screen.getByText("12,500")).toBeInTheDocument();
    expect(screen.getByText("2,500,000")).toBeInTheDocument();
  });

  it("preserves distinct actual prices for partial Limit fills instead of rounding them to amount precision", () => {
    const { container } = renderTable({
      kind: "limit",
      items: [
        row(1, { rate: "0.1234567", soldAmount: "100", purchasedAmount: "12.34567" }),
        row(2, { rate: "0.1245678", soldAmount: "50", purchasedAmount: "6.22839" }),
      ],
    });
    const prices = Array.from(
      container.querySelectorAll(".history-row:not(.history-header)"),
      row => row.children[1].textContent,
    );
    expect(prices).toEqual(["0.123456", "0.124567"]);
  });

  it.each([
    { decimals: 6, amount: "1.079988" },
    { decimals: 18, amount: "1.079988123456789012" },
  ])("preserves all $decimals output-token decimals instead of truncating filled amounts", ({ decimals, amount }) => {
    const { container } = renderTable({
      kind: "limit",
      outputToken: { ...token("ATOM"), decimals },
      items: [row(1, { rate: amount, soldAmount: "1", purchasedAmount: amount })],
    });

    expect(
      container.querySelector(".history-row:not(.history-header)")?.children[3].firstElementChild?.textContent,
    ).toBe(amount);
    expect(screen.getByTitle(`${amount} ATOM`)).toBeInTheDocument();
  });

  it("preserves nonzero history amounts smaller than six decimal places", () => {
    renderTable({
      kind: "limit",
      outputToken: { ...token("ATOM"), decimals: 18 },
      items: [row(1, { purchasedAmount: "0.000000123456789012" })],
    });

    expect(screen.getByText("0.000000123456789012")).toBeInTheDocument();
    expect(screen.getByTitle("0.000000123456789012 ATOM")).toBeInTheDocument();
  });

  it("links every row to its transaction on Gnoscan", () => {
    const { container } = renderTable({ items: [row(1), row(2)] });

    const hrefs = Array.from(container.querySelectorAll("a")).map(anchor => anchor.getAttribute("href"));
    expect(hrefs).toEqual(["https://gnoscan.io/tx/tx1", "https://gnoscan.io/tx/tx2"]);
  });

  it("paginates only when there is more than one page", () => {
    const changePage = jest.fn();
    const { rerender } = renderTable({ totalPages: 1, changePage });
    expect(screen.queryByRole("button", { name: "2" })).not.toBeInTheDocument();

    rerender(
      <GnoswapThemeProvider>
        <OrderHistoryTable
          kind="dca"
          items={[row(1)]}
          inputToken={token("GNS")}
          outputToken={token("GNOT")}
          currentPage={1}
          totalPages={2}
          changePage={changePage}
        />
      </GnoswapThemeProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "2" }));
    expect(changePage).toHaveBeenCalledWith(2);
  });

  it("highlights rows that arrive while the first page is open", () => {
    const { container, rerender } = renderTable({ items: [row(1)] });
    expect(container.querySelectorAll(".highlight")).toHaveLength(0);

    rerender(
      <GnoswapThemeProvider>
        <OrderHistoryTable
          kind="dca"
          items={[row(2), row(1)]}
          inputToken={token("GNS")}
          outputToken={token("GNOT")}
          currentPage={1}
          totalPages={1}
          changePage={jest.fn()}
        />
      </GnoswapThemeProvider>,
    );
    expect(container.querySelectorAll(".highlight")).toHaveLength(1);
  });

  it.each([false, true])("keeps history backgrounds stable across pages (retained data: %s)", retainPreviousData => {
    const table = (page: number, dataPage = page, isPreviousData = false) => (
      <GnoswapThemeProvider>
        <OrderHistoryTable
          kind="dca"
          items={Array.from({ length: 10 }, (_, index) => row((dataPage - 1) * 10 + index))}
          inputToken={token("GNS")}
          outputToken={token("GNOT")}
          currentPage={page}
          totalPages={10}
          isPreviousData={isPreviousData}
          changePage={jest.fn()}
        />
      </GnoswapThemeProvider>
    );
    const { container, rerender } = render(table(1));
    if (retainPreviousData) rerender(table(10, 1, true));
    rerender(table(10));
    expect(container.querySelectorAll(".highlight")).toHaveLength(0);
    if (retainPreviousData) {
      rerender(table(1, 10, true));
      expect(container.querySelectorAll(".highlight")).toHaveLength(0);
    }
    rerender(table(1));
    expect(container.querySelectorAll(".highlight")).toHaveLength(0);
  });

  it("shows one time unit between 1s ago and >1y ago", () => {
    const now = NOW * 1000;
    expect(formatHistoryTime(NOW, now)).toBe("1s ago");
    expect(formatHistoryTime(NOW - 3 * 3600, now)).toBe("3h ago");
    expect(formatHistoryTime(NOW - 40 * 86400, now)).toBe("40d ago");
    expect(formatHistoryTime(NOW - 400 * 86400, now)).toBe(">1y ago");
  });
});
