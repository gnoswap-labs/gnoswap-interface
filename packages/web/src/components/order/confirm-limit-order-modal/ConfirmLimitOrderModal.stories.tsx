import { css } from "@emotion/react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";
import React from "react";

import { STORY_LIMIT_ORDER_SUMMARY } from "../common/order-story-fixtures";
import ConfirmLimitOrderModal from "./ConfirmLimitOrderModal";

const meta = {
  title: "order/ConfirmLimitOrderModal",
  component: ConfirmLimitOrderModal,
  tags: ["autodocs"],
} satisfies Meta<typeof ConfirmLimitOrderModal>;

export default meta;
type Story = StoryObj<typeof ConfirmLimitOrderModal>;

export const Default: Story = {
  render: (args: React.ComponentProps<typeof ConfirmLimitOrderModal>) => (
    <div css={wrapper}>
      <ConfirmLimitOrderModal {...args} />
    </div>
  ),
  args: {
    summary: STORY_LIMIT_ORDER_SUMMARY,
    confirm: fn(),
    close: fn(),
  },
};

/** A price under the market gets a minus sign; 7 days is shown as a whole week. */
export const BelowMarket: Story = {
  ...Default,
  args: {
    ...Default.args,
    summary: {
      ...STORY_LIMIT_ORDER_SUMMARY,
      buyAmount: "1688.46",
      minimumReceived: "1680.0177",
      limitPrice: "1 GNS = 1.0953 GNOT",
      limitPriceDeviation: -0.0525,
      expiresAt: "2026-11-10 20:35:36",
      expiryDurationSec: 604_800,
    },
  },
};

/** With no market quote there is nothing to compare the price with; 30 days stays in days. */
export const WithoutMarketQuote: Story = {
  ...Default,
  args: {
    ...Default.args,
    summary: {
      ...STORY_LIMIT_ORDER_SUMMARY,
      limitPriceDeviation: null,
      expiresAt: "2026-12-04 20:35:36",
      expiryDurationSec: 2_592_000,
    },
  },
};

const wrapper = () => css`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
`;
