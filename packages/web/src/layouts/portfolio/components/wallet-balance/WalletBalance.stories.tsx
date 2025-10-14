import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";

import { DEVICE_TYPE } from "@styles/media";

import WalletBalance from "./WalletBalance";

const meta = {
  title: "wallet/WalletBalance",
  component: WalletBalance,
  tags: ["autodocs"],
} satisfies Meta<typeof WalletBalance>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof WalletBalance>]?: React.ComponentProps<typeof WalletBalance>[K];
}>;

export const ConnectionSucceeded: Story = {
  args: {
    connected: true,
    balanceSummaryInfo: {
      amount: "$1,000.00",
      changeRate: "+1.1%",
      loading: false,
    },
    balanceDetailInfo: {
      availableBalance: "$1.10",
      stakedLP: "$1.20",
      unstakedLP: "$1.30",
      claimableRewards: "$1.40",
      loadingBalance: false,
      loadingPositions: false,
      totalClaimedRewards: "$1.50",
    },
    deposit: fn(),
    withdraw: fn(),
    claimAll: fn(),
    breakpoint: DEVICE_TYPE.WEB,
  },
};

export const ConnectionFailed: Story = {
  args: {
    connected: false,
    balanceSummaryInfo: {
      amount: "$0.00",
      changeRate: "+0%",
      loading: false,
    },
    balanceDetailInfo: {
      availableBalance: "$0.00",
      stakedLP: "$0.00",
      unstakedLP: "$0.00",
      claimableRewards: "$0.00",
      loadingBalance: false,
      loadingPositions: false,
      totalClaimedRewards: "$1.50",
    },
    deposit: fn(),
    withdraw: fn(),
  },
};

export const LoadingData: Story = {
  args: {
    connected: true,
    balanceSummaryInfo: {
      amount: "$0.00",
      changeRate: "+0%",
      loading: false,
    },
    balanceDetailInfo: {
      availableBalance: "$0.00",
      stakedLP: "$0.00",
      unstakedLP: "$0.00",
      claimableRewards: "$0.00",
      loadingBalance: false,
      loadingPositions: false,
      totalClaimedRewards: "$1.50",
    },
    deposit: fn(),
    withdraw: fn(),
    claimAll: fn(),
  },
};
