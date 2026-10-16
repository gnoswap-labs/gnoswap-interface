import type { Meta, StoryObj } from "@storybook/nextjs";

import DelegationPoint from "./DelegationPoint";

const meta = {
  title: "leaderboard/DelegationPoint",
  component: DelegationPoint,
  tags: ["autodocs"],
  parameters: {
    backgrounds: { default: "light" },
  },
} satisfies Meta<typeof DelegationPoint>;

export default meta;
type Story = StoryObj<typeof DelegationPoint>;

export const Default: Story = {
  args: {
    gnsDelegationPoint: "36516.42",
    holdingDetail: { delegatedGnsAmount: "2500000000000", stakedPositionCount: 0, inRangePositionCount: 0 },
  },
};

export const WithoutHoldingDetail: Story = {
  args: {
    gnsDelegationPoint: "36516.42",
    holdingDetail: null,
  },
};
