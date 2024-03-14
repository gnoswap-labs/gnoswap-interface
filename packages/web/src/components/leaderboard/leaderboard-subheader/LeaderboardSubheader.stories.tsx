import { Meta, StoryObj } from "@storybook/react";
import LeaderboardSubheader from "./LeaderboardSubheader";

export default {
  title: "leaderboard/LeaderboardSubheader",
  component: LeaderboardSubheader,
} as Meta<typeof LeaderboardSubheader>;

export const Default: StoryObj<typeof LeaderboardSubheader> = {
  args: {
    conneted: false,
  },
};
