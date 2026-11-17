import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { GNOT_TOKEN, GNS_TOKEN } from "@common/values/token-constant";
import { DcaOrderModel } from "@models/order/dca-order-model";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { formatOrderDateTime } from "@utils/order-format-utils";

import DcaOrderItemCard from "./DcaOrderItemCard";

const ORDER: DcaOrderModel = {
  orderId: "1",
  packagePath: "gno.land/r/demo/dca",
  isCurrentRealm: true,
  status: "CANCELLED",
  isActive: false,
  inputToken: { ...GNOT_TOKEN, decimals: 6 },
  outputToken: { ...GNS_TOKEN, decimals: 18 },
  interval: 3600,
  executionCount: 2,
  executedCount: 1,
  remainingCount: 1,
  progress: 50,
  amountPerExecution: "1.079988",
  depositAmount: "2.159976",
  soldAmount: "1.079988",
  purchasedAmount: "2.079988123456789012",
  remainingAmount: "1.079988",
  claimedAmount: "0",
  claimableAmount: "2.079988123456789012",
  canClaim: false,
  forceCancelled: false,
  priceRate: null,
  returnRate: null,
  executionFeeRate: null,
  executionFeeAmount: null,
  poolPath: null,
  marketPrice: null,
  nextExecutionAt: null,
  createdAt: 1,
  closedAt: 3601,
  createdTxHash: "",
  closedTxHash: null,
};

const renderCard = (
  order: DcaOrderModel,
  marketPrice: string | null = null,
  outputTokenUsdPrice: string | null = null,
) =>
  render(
    <GnoswapThemeProvider>
      <DcaOrderItemCard
        order={order}
        marketPrice={marketPrice}
        outputTokenUsdPrice={outputTokenUsdPrice}
        txUrl=""
        onClickStop={jest.fn()}
        onClickClaim={jest.fn()}
        renderHistory={() => null}
      />
    </GnoswapThemeProvider>,
  );

const readOverview = async (order: DcaOrderModel) => {
  renderCard(order);
  await userEvent.hover(screen.getByRole("progressbar"));
  return screen.findByRole("tooltip");
};

const overviewValues = (tooltip: HTMLElement) =>
  Array.from(tooltip.querySelectorAll(".overview-row"), row => row.querySelector(".value")?.textContent);

const ACTIVE: DcaOrderModel = {
  ...ORDER,
  status: "ACTIVE",
  isActive: true,
  closedAt: null,
  priceRate: "1.926",
  executionFeeRate: 15,
  executionFeeAmount: "0.003125",
};

const metricValues = (container: HTMLElement) =>
  Array.from(container.querySelectorAll(".metric .metric-value"), element => element.textContent);

const termValue = (label: string) =>
  screen.getByText(label).closest(".card-sub-info")?.querySelector(".value")?.textContent ?? null;

it("preserves each token's precision in the DCA deposit and purchased amounts", async () => {
  const { container } = renderCard(ORDER);

  expect(screen.getByText("2.159976 GNOT")).toBeInTheDocument();
  await userEvent.hover(container.querySelectorAll<HTMLElement>(".metric .metric-value")[2]);
  expect(await screen.findByRole("tooltip")).toHaveTextContent("2.079988123456789012 GNS");
});

describe("DcaOrderItemCard metrics", () => {
  it("shows the market price, the average executed price against it and the filled share", () => {
    const { container } = renderCard(ACTIVE, "1.8");

    expect(Array.from(container.querySelectorAll(".metric .metric-label"), element => element.textContent)).toEqual([
      "Swap:dca.marketPrice",
      "Executed Price (Avg)",
      "Swap:order.purchasedAmount",
    ]);
    expect(metricValues(container)).toEqual([
      "1.8 GNS",
      "1.926 GNS(+7%)",
      "2.079988123456789012 GNS({{percent}}% filled)",
    ]);
  });

  it("quotes the full market price for one input token in the tooltip", async () => {
    const { container } = renderCard(ACTIVE, "1.123456789");

    await userEvent.hover(container.querySelectorAll<HTMLElement>(".metric .metric-value")[0]);
    expect(await screen.findByRole("tooltip")).toHaveTextContent("1 GNOT = 1.123456789 GNS");
  });

  it("shows no price or deviation while the market price or the fills are unknown", () => {
    const { container } = renderCard(ORDER);

    expect(metricValues(container).slice(0, 2)).toEqual(["-", "-"]);
  });
});

describe("DcaOrderItemCard order terms", () => {
  const NOW = 1_800_000_000;

  beforeEach(() => {
    jest.useFakeTimers({ now: NOW * 1000, advanceTimers: true });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("shows the placed terms, the schedule left, the fee charged and the expiry of an open order", () => {
    const order = { ...ACTIVE, nextExecutionAt: NOW + 30 * 60, remainingCount: 2 };
    renderCard(order, null, "20");

    expect(termValue("Swap:dca.every")).toBe("Swap:dca.intervalPhrase.hour");
    expect(termValue("Swap:order.order")).toBe("2 Swap:dca.orders");
    expect(termValue("Swap:order.nextTrade")).toBe("30m");
    expect(termValue("Swap:order.remainingTrades")).toBe("2 Swap:dca.orders");
    expect(termValue("Swap:dca.executionFee (0.15%)")).toBe("0.003125 GNS ($0.0625)");
    // The last round runs one interval after the next one.
    expect(termValue("Swap:order.expiresAt")).toBe(`${formatOrderDateTime(NOW + 30 * 60 + 3600)} (in 2 hours)`);
  });

  it("drops the countdowns of a closed order and keeps the fee it paid", () => {
    renderCard({ ...ORDER, remainingCount: 0, executionFeeRate: 15, executionFeeAmount: "0.003125" });

    expect(screen.queryByText("Swap:order.nextTrade")).not.toBeInTheDocument();
    expect(screen.queryByText("Swap:order.expiresAt")).not.toBeInTheDocument();
    expect(termValue("Swap:order.remainingTrades")).toBe("0 Swap:dca.orders");
    expect(termValue("Swap:dca.executionFee (0.15%)")).toBe("0.003125 GNS");
  });

  it("shows a dash, not a zero, when the order-api reports no fee", () => {
    renderCard(ORDER);

    expect(termValue("Swap:dca.executionFee")).toBe("-");
  });
});

it("shows sold share, unfilled deposit and precise purchased output while open", async () => {
  const tooltip = await readOverview({ ...ORDER, status: "ACTIVE", isActive: true, closedAt: null });
  expect(overviewValues(tooltip)).toEqual([
    "1.079988 / 2.159976 GNOT (50%)",
    "1.079988 GNOT",
    "2.079988123456789012 GNS",
  ]);
});

it("preserves the historically unfilled amount after cancellation refunds empty the escrow", async () => {
  const tooltip = await readOverview({ ...ORDER, remainingAmount: "0", remainingCount: 0 });
  expect(overviewValues(tooltip)).toEqual([
    "1.079988 / 2.159976 GNOT (50%)",
    "1.079988 GNOT",
    "2.079988123456789012 GNS",
    formatOrderDateTime(ORDER.closedAt),
  ]);
  expect(tooltip.querySelectorAll(".overview-row .label")[3]).toHaveTextContent("Swap:order.cancelledAt");
});

it("shows no unfilled deposit and the actual completion time after every execution", async () => {
  const tooltip = await readOverview({
    ...ORDER,
    status: "COMPLETED",
    executedCount: 2,
    remainingCount: 0,
    progress: 100,
    soldAmount: ORDER.depositAmount,
    remainingAmount: "0",
  });
  expect(overviewValues(tooltip)).toEqual([
    "2.159976 / 2.159976 GNOT (100%)",
    "0 GNOT",
    "2.079988123456789012 GNS",
    formatOrderDateTime(ORDER.closedAt),
  ]);
  expect(tooltip.querySelectorAll(".overview-row .label")[3]).toHaveTextContent("Swap:order.completedAt");
});

it.each(["COMPLETED", "CANCELLED"] as const)("does not invent a close time for a %s order", async status => {
  const tooltip = await readOverview({ ...ORDER, status, closedAt: null });
  expect(overviewValues(tooltip).at(-1)).toBe("-");
});
