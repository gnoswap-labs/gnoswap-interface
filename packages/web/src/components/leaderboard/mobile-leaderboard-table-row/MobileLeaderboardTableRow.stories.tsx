import MobileLeaderboardTableRow from "./MobileLeaderboardTableRow";
import { ComponentMeta, StoryObj } from "@storybook/react";

export default {
  title: "leaderboard/MobileLeaderboardTableRow",
  component: MobileLeaderboardTableRow,
} as ComponentMeta<typeof MobileLeaderboardTableRow>;

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
