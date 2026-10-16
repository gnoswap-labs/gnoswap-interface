import type { Meta, StoryObj } from "@storybook/nextjs";

import StakingPoint from "./StakingPoint";

const meta = {
  title: "leaderboard/StakingPoint",
  component: StakingPoint,
  tags: ["autodocs"],
  parameters: {
    backgrounds: { default: "light" },
  },
} satisfies Meta<typeof StakingPoint>;

export default meta;
type Story = StoryObj<typeof StakingPoint>;

export const Default: Story = {
  args: {
    positionStakingPoint: "760.2",
    holdingDetail: { delegatedGnsAmount: "0", stakedPositionCount: 3, inRangePositionCount: 2 },
  },
};

export const WithoutHoldingDetail: Story = {
  args: {
    positionStakingPoint: "760.2",
    holdingDetail: null,
  },
};
