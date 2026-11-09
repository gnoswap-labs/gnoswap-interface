import { css } from "@emotion/react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";
import React from "react";

import { STORY_GNOT_TOKEN, STORY_GNS_TOKEN } from "@components/order/common/order-story-fixtures";

import LimitOrderCard from "./LimitOrderCard";

const meta = {
  title: "swap/LimitOrderCard",
  component: LimitOrderCard,
  tags: ["autodocs"],
} satisfies Meta<typeof LimitOrderCard>;

export default meta;
type Story = StoryObj<typeof LimitOrderCard>;

export const Default: Story = {
  render: (args: React.ComponentProps<typeof LimitOrderCard>) => (
    <div css={wrapper}>
      <div css={cardWrap}>
        <LimitOrderCard {...args} />
      </div>
    </div>
  ),
  args: {
    swapType: "limit",
    changeSwapType: fn(),
    copied: false,
    copyURL: fn(),
    slippage: 0.5,
    maxSlippage: 10,
    changeSlippage: fn(),
    themeKey: "dark",
    isLoading: false,
    connectedWallet: true,
    tokenA: STORY_GNS_TOKEN,
    tokenB: STORY_GNOT_TOKEN,
    tokenABalance: "1541.5",
    tokenBBalance: "1541.5",
    sellAmount: "1541.55",
    sellAmountUsd: "$1,541.55",
    buyAmount: "1960.235",
    buyAmountUsd: "$1,541.55",
    changeTokenA: fn(),
    changeTokenB: fn(),
    changeSellAmount: fn(),
    switchTokens: fn(),
    limitPrice: "1.2716",
    limitPriceUsd: "$1",
    marketPrice: "1.2716",
    changeLimitPrice: fn(),
    stepPrice: fn(),
    applyPreset: fn(),
    expiry: 86400,
    expiryOptions: [
      { value: 3600, label: "1 Hour" },
      { value: 86400, label: "1 Day" },
      { value: 604800, label: "1 Week" },
      { value: 2592000, label: "30 Days" },
    ],
    changeExpiry: fn(),
    buttonState: "PLACE_ORDER",
    buttonText: "Start to Order",
    minTradingText: "Minimum 0.0001 GNS",
    onClickButton: fn(),
  },
};

export const SmallMarketPrice: Story = {
  ...Default,
  args: { ...Default.args, marketPrice: "0.0000044053" },
};

export const LargeMarketPrice: Story = {
  ...Default,
  args: { ...Default.args, marketPrice: "74309.7" },
};

export const AmountTooLow: Story = {
  ...Default,
  args: { ...Default.args, sellAmount: "10", buttonState: "AMOUNT_TOO_LOW", buttonText: "Amount Too Low" },
};

const wrapper = () => css`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const cardWrap = () => css`
  width: 500px;
  max-width: 100%;
`;
