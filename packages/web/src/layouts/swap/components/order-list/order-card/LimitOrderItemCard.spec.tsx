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
  side: null,
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

/** Hovers the progress bar and reads the amounts and timestamps shown in Overview. */
const readOverview = async (order: LimitOrderModel) => {
  render(
    <GnoswapThemeProvider>
      <LimitOrderItemCard
        order={order}
        marketPrice={null}
        txUrl=""
        onClickCancel={jest.fn()}
        renderHistory={() => null}
      />
    </GnoswapThemeProvider>,
  );

  await userEvent.hover(screen.getByRole("progressbar"));
  const tooltip = await screen.findByRole("tooltip");
  return Array.from(tooltip.querySelectorAll(".overview-row"), row => row.querySelector(".value")?.textContent);
};

describe("LimitOrderItemCard overview", () => {
  it("shows the filled share, remaining input and purchased output while open", async () => {
    expect(await readOverview(partiallyFilled)).toEqual(["35 / 100 GNOT (35%)", "65 GNOT", "4.37342 GNS"]);
  });

  it("shows zero purchased and the whole input remaining before the first fill", async () => {
    const unfilled: LimitOrderModel = {
      ...partiallyFilled,
      status: "OPEN",
      filledInput: "0",
      remainingInput: "100",
      userOutput: "0",
      priceRate: null,
      progress: 0,
    };
    expect(await readOverview(unfilled)).toEqual(["0 / 100 GNOT (0%)", "100 GNOT", "0 GNS"]);
  });

  it.each<[LimitOrderModel["status"], Partial<LimitOrderModel>, string, string, string, number]>([
    [
      "COMPLETED",
      { filledInput: "100", userOutput: "12.495486", progress: 100 },
      "100 / 100 GNOT (100%)",
      "0 GNOT",
      "12.495486 GNS",
      CLOSED_AT,
    ],
    [
      "CANCELLED",
      { filledInput: "35", refundedInput: "65", userOutput: "4.37342" },
      "35 / 100 GNOT (35%)",
      "65 GNOT",
      "4.37342 GNS",
      CLOSED_AT,
    ],
    [
      "EXPIRED",
      { filledInput: "0", refundedInput: "100", userOutput: "0", progress: 0 },
      "0 / 100 GNOT (0%)",
      "100 GNOT",
      "0 GNS",
      EXPIRES_AT,
    ],
    [
      "CANCELLED",
      { filledInput: "0", refundedInput: "100", userOutput: "0", progress: 0 },
      "0 / 100 GNOT (0%)",
      "100 GNOT",
      "0 GNS",
      CLOSED_AT,
    ],
  ])(
    "shows unfilled amounts including refunds and the event date for a %s order",
    async (status, fills, sold, remaining, purchased, date) => {
      expect(await readOverview(closed(status, fills))).toEqual([
        sold,
        remaining,
        purchased,
        formatOrderDateTime(date),
      ]);
    },
  );

  it("shows unrefunded expired input and the expiry date even before cleanup closes the order", async () => {
    const expired = closed("EXPIRED", {
      closedAt: null,
      filledInput: "0",
      remainingInput: "100",
      userOutput: "0",
      progress: 0,
      canCancel: true,
    });
    expect(await readOverview(expired)).toEqual([
      "0 / 100 GNOT (0%)",
      "100 GNOT",
      "0 GNS",
      formatOrderDateTime(EXPIRES_AT),
    ]);
  });

  it("preserves a single raw unit of unfilled input above the JavaScript safe integer range", async () => {
    const values = await readOverview(
      closed("CANCELLED", {
        makingAmount: "9007199254740993.000001",
        filledInput: "9007199254740993",
        refundedInput: "0.000001",
      }),
    );
    expect(values[1]).toBe("0.000001 GNOT");
  });

  it.each<LimitOrderModel["status"]>(["CANCELLED", "COMPLETED"])(
    "does not substitute the expiry for an unknown %s close date",
    async status => {
      const values = await readOverview(closed(status, { closedAt: null }));
      expect(values.at(-1)).toBe("-");
    },
  );
});

describe("LimitOrderItemCard purchased amount", () => {
  it.each([
    { decimals: 6, amount: "1.079988" },
    { decimals: 18, amount: "1.079988123456789012" },
  ])("preserves $decimals token decimals in the summary metric", ({ decimals, amount }) => {
    render(
      <GnoswapThemeProvider>
        <LimitOrderItemCard
          order={{ ...partiallyFilled, tokenOut: { ...partiallyFilled.tokenOut, decimals }, userOutput: amount }}
          marketPrice={null}
          txUrl=""
          onClickCancel={jest.fn()}
          renderHistory={() => null}
        />
      </GnoswapThemeProvider>,
    );

    expect(screen.getByText(`${amount} GNS`)).toBeInTheDocument();
  });
});

describe("LimitOrderItemCard execution fee", () => {
  const renderFee = (order: LimitOrderModel, tokenOutUsdPrice: string | null = null) => {
    render(
      <GnoswapThemeProvider>
        <LimitOrderItemCard
          order={order}
          marketPrice={null}
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

describe("LimitOrderItemCard recorded side", () => {
  it.each(["buy", "sell", null] as const)("uses the recorded %s perspective without inferring legacy intent", side => {
    const { container } = render(
      <GnoswapThemeProvider>
        <LimitOrderItemCard
          order={{ ...partiallyFilled, side, limitPrice: "0.125", takingAmount: "12.5" }}
          marketPrice="0.1"
          txUrl=""
          onClickCancel={jest.fn()}
          renderHistory={() => null}
        />
      </GnoswapThemeProvider>,
    );
    expect(container.querySelector(".order-side")?.textContent ?? null).toBe(
      side ? `${side === "buy" ? "Buy GNS" : "Sell GNOT"}` : null,
    );
    const values = Array.from(container.querySelectorAll(".metric .value-text"), element => element.textContent);
    expect(values.slice(0, 2)).toEqual(
      side === "buy" ? ["10 GNOT", "8 GNOT"] : side === "sell" ? ["0.1 GNS", "0.125 GNS"] : ["0.1", "0.125"],
    );
  });
});
