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
  nextExecutionAt: null,
  createdAt: 1,
  closedAt: 3601,
  createdTxHash: "",
  closedTxHash: null,
};

const renderCard = (order: DcaOrderModel) =>
  render(
    <GnoswapThemeProvider>
      <DcaOrderItemCard
        order={order}
        roi={null}
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

it("preserves each token's precision in the DCA deposit, sold and purchased amounts", () => {
  renderCard(ORDER);

  expect(screen.getByText("2.159976 GNOT")).toBeInTheDocument();
  expect(screen.getByText("1.079988 GNOT")).toBeInTheDocument();
  expect(screen.getByText("2.079988123456789012 GNS")).toBeInTheDocument();
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
