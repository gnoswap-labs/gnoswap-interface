import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";

import { DEVICE_TYPE } from "@styles/media";

import WalletBalanceDetail from "./WalletBalanceDetail";

const meta = {
  title: "wallet/WalletBalance/WalletBalanceDetail",
  component: WalletBalanceDetail,
  tags: ["autodocs"],
} satisfies Meta<typeof WalletBalanceDetail>;

export default meta;
type Story = StoryObj<typeof WalletBalanceDetail>;

export const Default: Story = {
  args: {
    balanceDetailInfo: {
      availableBalance: "$1.10",
      stakedLP: "$1.20",
      unstakedLP: "$1.30",
      claimableRewards: "$1.40",
      loadingBalance: false,
      loadingPositions: false,
      totalClaimedRewards: "$1.50",
    },
    connected: true,
    claimAll: fn(),
    breakpoint: DEVICE_TYPE.WEB,
  },
};
