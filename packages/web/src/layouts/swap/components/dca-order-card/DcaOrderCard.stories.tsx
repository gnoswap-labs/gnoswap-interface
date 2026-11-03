import { css } from "@emotion/react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";
import React from "react";

import {
  STORY_DCA_ORDER_SUMMARY,
  STORY_GNOT_TOKEN,
  STORY_GNS_TOKEN,
} from "@components/order/common/order-story-fixtures";
import { DCA_INTERVAL_UNITS } from "@models/order/dca-order-model";

import DcaOrderCard from "./DcaOrderCard";

const meta = {
  title: "swap/DcaOrderCard",
  component: DcaOrderCard,
  tags: ["autodocs"],
} satisfies Meta<typeof DcaOrderCard>;

export default meta;
type Story = StoryObj<typeof DcaOrderCard>;

export const Default: Story = {
  render: (args: React.ComponentProps<typeof DcaOrderCard>) => (
    <div css={wrapper}>
      <div css={cardWrap}>
        <DcaOrderCard {...args} />
      </div>
    </div>
  ),
  args: {
    swapType: "dca",
    changeSwapType: fn(),
    copied: false,
    copyURL: fn(),
    slippage: 0.5,
    changeSlippage: fn(),
    themeKey: "dark",
    isLoading: false,
    connectedWallet: true,
    tokenA: STORY_GNS_TOKEN,
    tokenB: STORY_GNOT_TOKEN,
    tokenABalance: "1541.5",
    sellAmount: "1500",
    sellAmountUsd: "$1,541.02",
    changeTokenA: fn(),
    changeTokenB: fn(),
    changeSellAmount: fn(),
    switchTokens: fn(),
    interval: 60,
    intervalOptions: DCA_INTERVAL_UNITS,
    changeInterval: fn(),
    executionCountInput: "2",
    maxExecutionCount: 30,
    changeExecutionCount: fn(),
    commitExecutionCount: fn(),
    summary: { ...STORY_DCA_ORDER_SUMMARY, sellAmount: "1500", executionCount: 2, amountPerOrder: "750" },
    buttonState: "PLACE_ORDER",
    buttonText: "Place Order",
    minTradingText: "Minimum 0.000001 GNS per order",
    onClickButton: fn(),
  },
};

export const AmountTooLow: Story = {
  ...Default,
  args: { ...Default.args, executionCountInput: "40", buttonState: "AMOUNT_TOO_LOW", buttonText: "Amount Too Low" },
};

export const WalletLogin: Story = {
  ...Default,
  args: {
    ...Default.args,
    connectedWallet: false,
    tokenABalance: "-",
    sellAmount: "",
    summary: null,
    buttonState: "WALLET_LOGIN",
    buttonText: "Wallet Login",
  },
};

export const Loading: Story = {
  ...Default,
  args: { ...Default.args, isLoading: true },
};

const wrapper = () => css`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const cardWrap = () => css`
  width: 500px;
`;
