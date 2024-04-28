import LeaderboardTableRow from "./LeaderboardTableRow";
import { ComponentMeta, StoryObj } from "@storybook/react";

export default {
  title: "leaderboard/LeaderboardTableRow",
  component: LeaderboardTableRow,
} as ComponentMeta<typeof LeaderboardTableRow>;

const item = {
  rank: 1,

  hide: false,

  address: "g1122u9x3d2p11mlqm3yrzqijqnee5oni2l7xnf5",
  formattedAddress: "g1122u9x...i2l7xnf5",
  mobileSpecificFormattedAddress: "g112...xnf5",

  swapVolume: "$241,421",
  positionValue: "$100,241,421",
  stakingValue: "$241,421",

  pointSum: "4,802,250",
  swapFeePoint: "242,802,250250000000000",
  poolRewardPoint: "1,000,000",
  stakingRewardPoint: "700,000",
  referralRewardPoint: "300,000",
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
