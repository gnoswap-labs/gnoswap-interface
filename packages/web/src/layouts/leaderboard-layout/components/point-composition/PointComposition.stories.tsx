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
  totalPoint: "37490.99",
  items: [
    { label: "Leaderboard:list.column.staking", point: "36516.42" },
    { label: "Leaderboard:list.column.delegation", point: "2.65" },
    { label: "Leaderboard:list.column.swap", point: "211.7" },
    { label: "Leaderboard:list.column.referral", point: "0" },
  ],
  globalCapRatio: "1.00",
  isProvisional: true,
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
