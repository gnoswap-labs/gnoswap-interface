import LeaderboardTableRow from "./LeaderboardTableRow";
import { ComponentMeta, StoryObj } from "@storybook/react";

export default {
  title: "leaderboard/LeaderboardTableRow",
  component: LeaderboardTableRow,
} as ComponentMeta<typeof LeaderboardTableRow>;

const item = {
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
};

const tdWidths = [120, 300, 170, 170, 170, 170];

export const Me: StoryObj<typeof LeaderboardTableRow> = {
  args: {
    item,
    tdWidths,
    isMobile: false,
    me: true,
  },
  parameters: {
    backgrounds: { default: "light" },
  },
};

export const NotMe: StoryObj<typeof LeaderboardTableRow> = {
  args: {
    item,
    tdWidths,
    isMobile: false,
    me: false,
  },
  parameters: {
    backgrounds: { default: "light" },
  },
};
