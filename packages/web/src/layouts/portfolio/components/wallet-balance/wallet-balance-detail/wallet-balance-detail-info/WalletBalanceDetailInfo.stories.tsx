import type { Meta, StoryObj } from "@storybook/nextjs";

import WalletBalanceDetailInfo from "./WalletBalanceDetailInfo";

const meta = {
  title: "wallet/WalletBalance/WalletBalanceDetail/WalletBalanceDetailInfo",
  component: WalletBalanceDetailInfo,
  tags: ["autodocs"],
} satisfies Meta<typeof WalletBalanceDetailInfo>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof WalletBalanceDetailInfo>]?: React.ComponentProps<
    typeof WalletBalanceDetailInfo
  >[K];
}>;

export const Default: Story = {
  args: {
    title: "Default",
    value: "$1.10",
    tooltip: undefined,
  },
};

export const DefaultTooltip: Story = {
  args: {
    title: "DefaultTooltip",
    value: "$1.10",
    tooltip: "Hello world",
  },
};
