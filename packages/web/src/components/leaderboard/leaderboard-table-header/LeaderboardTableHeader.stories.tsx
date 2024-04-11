import LeaderboardTableHeader from "./LeaderboardTableHeader";
import { ComponentMeta, StoryObj } from "@storybook/react";

export default {
  title: "leaderboard/LeaderboardTableHeader",
  component: LeaderboardTableHeader,
} as ComponentMeta<typeof LeaderboardTableHeader>;

export const Default: StoryObj<typeof LeaderboardTableHeader> = {
  args: {
    heads: [
      "Rank",
      "User",
      "Swap Volume",
      "Position Value",
      "Staking Value",
      "Points",
    ],
    headWidths: [120, 400, 200, 200, 200, 240],
  },
  parameters: {
    backgrounds: { default: "light" },
  },
};
