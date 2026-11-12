import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { LimitOrderModel } from "@models/order/limit-order-model";
import { TokenModel } from "@models/token/token-model";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { formatOrderDateTime } from "@utils/order-format-utils";

import LimitOrderItemCard from "./LimitOrderItemCard";

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

const EXPIRES_AT = 1_794_308_901;
const CLOSED_AT = 1_794_222_509;

// 100 GNOT for 12.4308 GNS at 0.5% slippage, with 35 GNOT sold so far.
const partiallyFilled: LimitOrderModel = {
  orderId: "7",
  packagePath: "gno.land/r/demo/limit",
  isCurrentRealm: true,
  status: "PARTIALLY_FILLED",
  isActive: true,
  tokenIn: token("GNOT"),
  tokenOut: token("GNS"),
  makingAmount: "100",
  takingAmount: "12.4308",
  slippageBps: 50,
  minimumReceived: "12.368646",
  minimumRemainingReceived: "8.03962",
  executionFeeRate: 15,
  cumulativeExecutionFee: "0.018771",
  filledInput: "35",
  remainingInput: "65",
  refundedInput: "0",
  userOutput: "4.37342",
  canCancel: false,
  limitPrice: "0.124308",
  priceRate: "0.124955",
  progress: 35,
  createdAt: 1_793_660_400,
  expiresAt: EXPIRES_AT,
  closedAt: null,
  createdTxHash: "",
  closedTxHash: null,
};

const closed = (status: LimitOrderModel["status"], overrides: Partial<LimitOrderModel> = {}): LimitOrderModel => ({
  ...partiallyFilled,
  status,
  isActive: false,
  remainingInput: "0",
  minimumRemainingReceived: "0",
  closedAt: CLOSED_AT,
  ...overrides,
});

/** Hovers the progress bar and reads the Overview tooltip as `[label, value]` rows. */
const readOverview = async (order: LimitOrderModel) => {
  render(
    <GnoswapThemeProvider>
      <LimitOrderItemCard order={order} txUrl="" onClickCancel={jest.fn()} renderHistory={() => null} />
    </GnoswapThemeProvider>,
  );

  await userEvent.hover(screen.getByRole("progressbar"));
  const tooltip = await screen.findByRole("tooltip");
  return Array.from(tooltip.querySelectorAll(".overview-row"), row => [
    row.querySelector(".label")?.textContent,
    row.querySelector(".value")?.textContent,
  ]);
};

describe("LimitOrderItemCard overview", () => {
  it("lists the sold, remaining and minimum remaining amounts, then the expiry, while an order is open", async () => {
    expect(await readOverview(partiallyFilled)).toEqual([
      ["Swap:order.soldAmount", "35 / 100 GNOT (35%)"],
      ["Swap:order.remainingAmount", "65 GNOT"],
      ["Swap:order.minimumRemaining", "8.03962 GNS"],
      ["Swap:order.expiresAt", formatOrderDateTime(EXPIRES_AT)],
    ]);
  });

  it("covers the whole order before anything is sold", async () => {
    const unfilled: LimitOrderModel = {
      ...partiallyFilled,
      status: "OPEN",
      filledInput: "0",
      remainingInput: "100",
      minimumRemainingReceived: "12.368646",
      userOutput: "0",
      priceRate: null,
      progress: 0,
    };

    expect(await readOverview(unfilled)).toEqual([
      ["Swap:order.soldAmount", "0 / 100 GNOT (0%)"],
      ["Swap:order.remainingAmount", "100 GNOT"],
      ["Swap:order.minimumRemaining", "12.368646 GNS"],
      ["Swap:order.expiresAt", formatOrderDateTime(EXPIRES_AT)],
    ]);
  });

  it.each<[LimitOrderModel["status"], Partial<LimitOrderModel>, string, string]>([
    ["COMPLETED", { filledInput: "100", userOutput: "12.495486", progress: 100 }, "100 GNOT", "12.495486 GNS"],
    ["CANCELLED", { filledInput: "35", userOutput: "4.37342" }, "35 GNOT", "4.37342 GNS"],
    ["EXPIRED", { filledInput: "0", userOutput: "0", progress: 0 }, "0 GNOT", "0 GNS"],
  ])("reports what happened to a %s order, with nothing remaining", async (status, fills, sold, purchased) => {
    expect(await readOverview(closed(status, fills))).toEqual([
      ["Swap:order.orderAmount", "100 GNOT"],
      ["Swap:order.soldAmount", sold],
      ["Swap:order.purchasedAmount", purchased],
      ["Swap:order.closedAt", formatOrderDateTime(CLOSED_AT)],
    ]);
  });

  it("does not present the expiry as the close time of an expired order that is not closed yet", async () => {
    // Its input is still escrowed until refunded, yet a closed order lists no remaining amount.
    const expired = closed("EXPIRED", {
      closedAt: null,
      filledInput: "0",
      remainingInput: "100",
      minimumRemainingReceived: "12.368646",
      userOutput: "0",
      canCancel: true,
    });

    expect(await readOverview(expired)).toEqual([
      ["Swap:order.orderAmount", "100 GNOT"],
      ["Swap:order.soldAmount", "0 GNOT"],
      ["Swap:order.purchasedAmount", "0 GNS"],
      ["Swap:order.closedAt", "-"],
    ]);
  });
});

describe("LimitOrderItemCard execution fee", () => {
  const renderFee = (order: LimitOrderModel, tokenOutUsdPrice: string | null = null) => {
    render(
      <GnoswapThemeProvider>
        <LimitOrderItemCard
          order={order}
          tokenOutUsdPrice={tokenOutUsdPrice}
          txUrl=""
          onClickCancel={jest.fn()}
          renderHistory={() => null}
        />
      </GnoswapThemeProvider>,
    );
    const row = screen.getByText("Swap:dca.executionFee (0.15%)").closest(".card-sub-info");
    return row?.querySelector(".value")?.textContent;
  };

  it("shows the saved rate and the fee actually charged, valued at the current price", () => {
    expect(renderFee(partiallyFilled, "1.2")).toBe("0.018771 GNS (≈$0.0225)");
  });

  it("shows a known zero fee as zero, for an order that closed unfilled", () => {
    const unfilled = closed("EXPIRED", { filledInput: "0", userOutput: "0", cumulativeExecutionFee: "0" });

    expect(renderFee(unfilled, "1.2")).toBe("0 GNS");
  });

  it("shows a dash, not a zero, when the order-api does not report the fee", () => {
    expect(renderFee({ ...partiallyFilled, cumulativeExecutionFee: null }, "1.2")).toBe("-");
  });

  it("shows the fee without a USD value while the price is unknown", () => {
    expect(renderFee(closed("COMPLETED", { cumulativeExecutionFee: "0.018771" }))).toBe("0.018771 GNS");
  });
});
