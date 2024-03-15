import MobileLeaderboardTableRow from "./MobileLeaderboardTableRow";
import { ComponentMeta, StoryObj } from "@storybook/react";

export default {
  title: "leaderboard/MobileLeaderboardTableRow",
  component: MobileLeaderboardTableRow,
} as ComponentMeta<typeof MobileLeaderboardTableRow>;

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

const tdWidths = [120, 400, 200, 200, 200, 240];

export const Me: StoryObj<typeof MobileLeaderboardTableRow> = {
  args: { item, tdWidths, isMobile: false, me: true },
  parameters: {
    backgrounds: { default: "light" },
  },
};

export const NotMe: StoryObj<typeof MobileLeaderboardTableRow> = {
  args: { item, tdWidths, isMobile: false, me: false },
  parameters: {
    backgrounds: { default: "light" },
  },
};
