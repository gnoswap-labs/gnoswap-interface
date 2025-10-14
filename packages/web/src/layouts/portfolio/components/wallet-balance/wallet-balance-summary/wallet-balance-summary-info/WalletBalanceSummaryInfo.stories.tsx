import type { Meta, StoryObj } from "@storybook/nextjs";

import WalletBalanceSummaryInfo from "./WalletBalanceSummaryInfo";

const meta = {
  title: "wallet/WalletBalance/WalletBalanceSummary/WalletBalanceSummaryInfo",
  component: WalletBalanceSummaryInfo,
  tags: ["autodocs"],
} satisfies Meta<typeof WalletBalanceSummaryInfo>;

export default meta;
type Story = StoryObj<typeof WalletBalanceSummaryInfo>;

export const Default: Story = {
  args: {
    balanceSummaryInfo: {
      amount: "1,000.00",
      changeRate: "+1.10%",
      loading: false,
    },
  },
};
