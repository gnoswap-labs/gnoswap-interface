import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";

import { STORY_GNOT_TOKEN, STORY_GNS_TOKEN } from "@components/order/common/order-story-fixtures";
import { DcaOrderModel } from "@models/order/dca-order-model";
import { formatOrderRoi } from "@utils/order-format-utils";

import DcaOrderItemCard from "./DcaOrderItemCard";

const NOW = Math.floor(Date.now() / 1000);
const MINUTE = 60;
const HOUR = 3_600;

/** Four of twelve hourly trades done and the next in 20 minutes, so the order ends in 7 hours 20 minutes. */
const ORDER: DcaOrderModel = {
  orderId: "preview-dca-order",
  packagePath: "gno.land/r/gnoswap/order/dca",
  isCurrentRealm: true,
  status: "ACTIVE",
  isActive: true,
  inputToken: STORY_GNS_TOKEN,
  outputToken: STORY_GNOT_TOKEN,
  interval: HOUR,
  executionCount: 12,
  executedCount: 4,
  remainingCount: 8,
  progress: 33.33,
  amountPerExecution: "100",
  depositAmount: "1200",
  soldAmount: "400",
  purchasedAmount: "416",
  remainingAmount: "800",
  claimedAmount: "0",
  claimableAmount: "0",
  canClaim: false,
  priceRate: "1.04",
  returnRate: 1.2,
  nextExecutionAt: NOW + 20 * MINUTE,
  createdAt: NOW - 4 * HOUR,
  closedAt: null,
  forceCancelled: false,
  createdTxHash: "",
  closedTxHash: null,
};

const COMPLETED: DcaOrderModel = {
  ...ORDER,
  status: "COMPLETED",
  isActive: false,
  executedCount: 12,
  remainingCount: 0,
  progress: 100,
  soldAmount: "1200",
  purchasedAmount: "1248",
  remainingAmount: "0",
  claimedAmount: "1248",
  nextExecutionAt: null,
  closedAt: Date.UTC(2026, 10, 12, 14, 35, 9) / 1000,
};

const CANCELLED: DcaOrderModel = {
  ...ORDER,
  status: "CANCELLED",
  isActive: false,
  remainingCount: 0,
  remainingAmount: "0",
  nextExecutionAt: null,
  closedAt: Date.UTC(2026, 10, 12, 9, 5, 30) / 1000,
};

const meta = {
  title: "swap/DcaOrderItemCard",
  component: DcaOrderItemCard,
  args: {
    order: ORDER,
    roi: formatOrderRoi(ORDER.returnRate),
    txUrl: "",
    onClickStop: fn(),
    onClickClaim: fn(),
    renderHistory: () => null,
  },
  decorators: [
    function WithRoomForOverview(Story) {
      return (
        <div style={{ width: 500, maxWidth: "100%", padding: 24, paddingTop: 240 }}>
          <Story />
        </div>
      );
    },
  ],
} satisfies Meta<typeof DcaOrderItemCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The header counts down to the last trade; hover the progress bar for the next trade and the trades left. */
export const Active: Story = {};

/** The last trade is the next one, so the order ends with it. */
export const ActiveLastTrade: Story = {
  args: {
    order: {
      ...ORDER,
      executedCount: 11,
      remainingCount: 1,
      progress: 91.67,
      nextExecutionAt: NOW + 5 * MINUTE,
    },
  },
};

/** Without a next trade the schedule is unknown, so the header shows no time left rather than a guess. */
export const ActiveWithoutSchedule: Story = {
  args: { order: { ...ORDER, nextExecutionAt: null } },
};

/** An interval that is none of the allowed units is told in seconds. */
export const ActiveUnknownInterval: Story = {
  args: { order: { ...ORDER, interval: 5_400 } },
};

export const Completed: Story = {
  args: { order: COMPLETED },
};

/** Every trade executed, but the output is still unpaid until it is claimed. */
export const CompletedAwaitingClaim: Story = {
  args: { order: { ...COMPLETED, claimedAmount: "0", claimableAmount: "1248", canClaim: true } },
};

export const Cancelled: Story = {
  args: { order: CANCELLED },
};

/** The order-api reported no close time: the header shows `-`, never the creation time or an expected end. */
export const ClosedWithoutTime: Story = {
  args: { order: { ...CANCELLED, closedAt: null } },
};

/** A narrow screen and wide symbols: the status goes under the pair instead of pushing it out of the card. */
export const ClosedWidePairMobile: Story = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
  args: {
    order: {
      ...COMPLETED,
      inputToken: { ...STORY_GNS_TOKEN, displaySymbol: "GNS.LONGSYMBOL" },
      outputToken: { ...STORY_GNOT_TOKEN, displaySymbol: "WUGNOT.LONGSYMBOL" },
      depositAmount: "123456789.123456",
    },
  },
};
