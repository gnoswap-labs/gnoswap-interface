import LeaderboardTableRow from "./LeaderboardTableRow";
import { ComponentMeta, StoryObj } from "@storybook/react";
import { LEADERBOARD_TD_WIDTH } from "@constants/skeleton.constant";

export default {
  title: "leaderboard/LeaderboardInfo",
  component: LeaderboardTableRow,
} as ComponentMeta<typeof LeaderboardTableRow>;

export const Default: StoryObj<typeof LeaderboardTableRow> = {
  args: {
    item: {
      rank: 2,
      user: "g1j0q...8auvm",
      volume: "$100,241,421",
      position: "$241,421",
      staking: "$241,421",
      points: "4,802,250",
      swapPoint: "242,802,250250000000000",
      positionPoint: "1,000,000",
      stakingPoint: "700,000",
      referralPoint: "300,000",
    },
    tdWidths: Object.values(LEADERBOARD_TD_WIDTH),
    children: <></>,
    isMobile: false,
  },
  parameters: {
    theme: "light",
  },
};
