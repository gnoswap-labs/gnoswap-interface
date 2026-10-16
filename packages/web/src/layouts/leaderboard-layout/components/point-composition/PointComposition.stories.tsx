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
  totalPoint: "20000000",
  items: [
    { label: "Leaderboard:list.column.swap", point: "20000000" },
    { label: "Leaderboard:list.column.swapRaw", point: "30000000" },
    { label: "Leaderboard:list.column.swapCap", point: "20000000" },
    { label: "Leaderboard:list.column.staking", point: "20000000" },
    { label: "Leaderboard:list.column.delegation", point: "20000000" },
    { label: "Leaderboard:list.column.referral", point: "20000000" },
  ],
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
