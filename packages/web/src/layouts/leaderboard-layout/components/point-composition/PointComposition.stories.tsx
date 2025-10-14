import type { Meta, StoryObj } from "@storybook/nextjs";

import PointComposition from "./PointComposition";

const meta = {
  title: "leaderboard/PointComposition",
  component: PointComposition,
  tags: ["autodocs"],
  parameters: {
    backgrounds: { default: "light" },
  },
} satisfies Meta<typeof PointComposition>;

export default meta;
type Story = StoryObj<typeof PointComposition>;

const commonArgs = {
  points: "20000000",
  swapPoint: "20000000",
  positionPoint: "20000000",
  stakingPoint: "20000000",
  referralPoint: "20000000",
};

export const Mobile: Story = {
  args: {
    ...commonArgs,
    isMobile: true,
  },
};

export const Web: Story = {
  args: {
    ...commonArgs,
    isMobile: false,
  },
};
