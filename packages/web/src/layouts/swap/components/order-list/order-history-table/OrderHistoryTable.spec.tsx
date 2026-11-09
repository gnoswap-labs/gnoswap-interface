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

  it("formats rate, sold and purchased with two decimals rounded down", () => {
    renderTable();

    expect(screen.getByText("10m ago")).toBeInTheDocument();
    expect(screen.getByText("1.15")).toBeInTheDocument();
    expect(screen.getByText("165.15")).toBeInTheDocument();
    expect(screen.getByText("152.15")).toBeInTheDocument();
  });

  it("applies the lower bound and K/M/B without trailing zeros", () => {
    renderTable({ items: [row(1, { rate: "0.004", soldAmount: "12500", purchasedAmount: "2500000" })] });

    expect(screen.getByText("<0.01")).toBeInTheDocument();
    expect(screen.getByText("12.5K")).toBeInTheDocument();
    expect(screen.getByText("2.5M")).toBeInTheDocument();
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
