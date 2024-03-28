import PointComposition from "./PointComposition";
import { ComponentMeta, StoryObj } from "@storybook/react";

export default {
  title: "leaderboard/PointComposition",
  component: PointComposition,
} as ComponentMeta<typeof PointComposition>;

export const Mobile: StoryObj<typeof PointComposition> = {
  args: {
    points: "20000000",
    swapPoint: "20000000",
    positionPoint: "20000000",
    stakingPoint: "20000000",
    referralPoint: "20000000",
    isMobile: true,
  },
  parameters: {
    backgrounds: { default: "light" },
  },
};

export const Web: StoryObj<typeof PointComposition> = {
  args: {
    points: "20000000",
    swapPoint: "20000000",
    positionPoint: "20000000",
    stakingPoint: "20000000",
    referralPoint: "20000000",
    isMobile: false,
  },
  parameters: {
    backgrounds: { default: "light" },
  },
};
