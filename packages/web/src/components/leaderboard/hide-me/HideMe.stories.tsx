import HideMe from "./HideMe";
import { ComponentMeta, StoryObj } from "@storybook/react";

export default {
  title: "leaderboard/HideMe",
  component: HideMe,
} as ComponentMeta<typeof HideMe>;

export const Mobile: StoryObj<typeof HideMe> = {
  args: { isMobile: true },
  parameters: {
    backgrounds: { default: "light" },
  },
};

export const Web: StoryObj<typeof HideMe> = {
  args: { isMobile: false },
  parameters: {
    backgrounds: { default: "light" },
  },
};
