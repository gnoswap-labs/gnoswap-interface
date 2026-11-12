import type { Meta, StoryObj } from "@storybook/nextjs";
import { createInstance } from "i18next";
import { useMemo } from "react";
import { I18nextProvider } from "react-i18next";

import { STORY_GNOT_TOKEN, STORY_GNS_TOKEN } from "@components/order/common/order-story-fixtures";
import { LimitOrderModel } from "@models/order/limit-order-model";

import enSwap from "../../../../../../public/locales/en/Swap.json";
import LimitOrderItemCard from "./LimitOrderItemCard";

const ORDER: LimitOrderModel = {
  orderId: "preview-limit-order",
  packagePath: "gno.land/r/gnoswap/order/limit",
  isCurrentRealm: true,
  status: "PARTIALLY_FILLED",
  isActive: true,
  tokenIn: STORY_GNS_TOKEN,
  tokenOut: STORY_GNOT_TOKEN,
  makingAmount: "100",
  takingAmount: "104",
  slippageBps: 50,
  minimumReceived: "103.48",
  minimumRemainingReceived: "67.262",
  executionFeeRate: 15,
  cumulativeExecutionFee: "0.054682",
  filledInput: "35",
  remainingInput: "65",
  refundedInput: "0",
  userOutput: "36.4",
  canCancel: false,
  limitPrice: "1.04",
  priceRate: "1.04",
  progress: 35,
  createdAt: Date.UTC(2026, 10, 5) / 1000,
  expiresAt: Date.UTC(2026, 10, 6) / 1000,
  closedAt: null,
  createdTxHash: "",
  closedTxHash: null,
};

const meta = {
  title: "swap/LimitOrderItemCard",
  component: LimitOrderItemCard,
  args: {
    order: ORDER,
    txUrl: "",
    tokenOutUsdPrice: "1.2",
    onClickCancel: () => undefined,
    renderHistory: () => null,
  },
  decorators: [
    function WithOrderTranslations(Story) {
      const i18n = useMemo(() => {
        const instance = createInstance();
        instance.init({ lng: "en", initImmediate: false, resources: { en: { Swap: enSwap } } });
        return instance;
      }, []);
      return (
        <I18nextProvider i18n={i18n}>
          <div style={{ width: 500, maxWidth: "100%", padding: 24, paddingTop: 240 }}>
            <Story />
          </div>
        </I18nextProvider>
      );
    },
  ],
} satisfies Meta<typeof LimitOrderItemCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PartiallyFilled: Story = {};

export const Unfilled: Story = {
  args: {
    order: {
      ...ORDER,
      status: "OPEN",
      filledInput: "0",
      remainingInput: "100",
      minimumRemainingReceived: "103.48",
      userOutput: "0",
      cumulativeExecutionFee: "0",
      priceRate: null,
      progress: 0,
    },
  },
};

export const SmallFill: Story = {
  args: {
    order: {
      ...ORDER,
      filledInput: "0.000001",
      remainingInput: "99.999999",
      minimumRemainingReceived: "103.479999",
      cumulativeExecutionFee: "0",
      userOutput: "0.00000104",
      progress: 0.000001,
    },
  },
};

export const Completed: Story = {
  args: {
    order: {
      ...ORDER,
      status: "COMPLETED",
      isActive: false,
      filledInput: "100",
      remainingInput: "0",
      minimumRemainingReceived: "0",
      userOutput: "103.844",
      cumulativeExecutionFee: "0.156",
      priceRate: "1.03844",
      progress: 100,
      closedAt: Date.UTC(2026, 10, 5, 8, 30) / 1000,
    },
  },
};

export const CancelledAfterFill: Story = {
  args: {
    order: {
      ...ORDER,
      status: "CANCELLED",
      isActive: false,
      remainingInput: "0",
      minimumRemainingReceived: "0",
      refundedInput: "65",
      closedAt: Date.UTC(2026, 10, 5, 12) / 1000,
    },
  },
};

/** Expired, but the input stays escrowed until it is refunded: closed, so no remaining amounts and no close time. */
export const ExpiredAwaitingRefund: Story = {
  args: {
    order: {
      ...ORDER,
      status: "EXPIRED",
      isActive: false,
      filledInput: "0",
      remainingInput: "100",
      minimumRemainingReceived: "103.48",
      userOutput: "0",
      cumulativeExecutionFee: "0",
      canCancel: true,
      priceRate: null,
      progress: 0,
    },
  },
};

/** The order-api does not report the fee yet: a dash, never a zero. */
export const FeeUnknown: Story = {
  args: { order: { ...ORDER, cumulativeExecutionFee: null } },
};

/** A fee of a single token unit, shown to the token's last decimal. */
export const TinyFee: Story = {
  args: { order: { ...ORDER, cumulativeExecutionFee: "0.000001" } },
};
