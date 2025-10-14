import type { Meta, StoryObj } from "@storybook/nextjs";

import LeaderboardTableHeader from "./LeaderboardTableHeader";

const meta = {
  title: "leaderboard/LeaderboardTableHeader",
  component: LeaderboardTableHeader,
  tags: ["autodocs"],
  parameters: {
    backgrounds: { default: "light" },
  },
} satisfies Meta<typeof LeaderboardTableHeader>;

export default meta;
type Story = StoryObj<typeof LeaderboardTableHeader>;

export const Default: Story = {
  args: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    heads: ["Rank", "User", "Swap Volume", "Position Value", "Staking Value", "Points"] as any,
    headWidths: [120, 400, 200, 200, 200, 240],
  },
};
