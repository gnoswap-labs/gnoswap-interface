import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";

import { DEVICE_TYPE } from "@styles/media";

import WalletBalanceSummary from "./WalletBalanceSummary";

const meta = {
  title: "wallet/WalletBalance/WalletBalanceSummary",
  component: WalletBalanceSummary,
  tags: ["autodocs"],
} satisfies Meta<typeof WalletBalanceSummary>;

export default meta;
type Story = StoryObj<typeof WalletBalanceSummary>;

export const ConnectionSucceeded: Story = {
  args: {
    connected: true,
    balanceSummaryInfo: {
      amount: "1,000.00",
      changeRate: "+1.10%",
      loading: false,
    },
    deposit: fn(),
    withdraw: fn(),
  },
};

export const ConnectionFailed: Story = {
  args: {
    connected: false,
    balanceSummaryInfo: {
      amount: "0.00",
      changeRate: "+0%",
      loading: false,
    },
    deposit: fn(),
    withdraw: fn(),
    breakpoint: DEVICE_TYPE.WEB,
  },
};
