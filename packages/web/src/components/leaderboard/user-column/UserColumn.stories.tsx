import UserColumn from "./UserColumn";
import { ComponentMeta, StoryObj } from "@storybook/react";

export default {
  title: "leaderboard/UserColumn",
  component: UserColumn,
} as ComponentMeta<typeof UserColumn>;

export const Gold: StoryObj<typeof UserColumn> = {
  args: { rank: 1, user: "g1j0q...8auvm" },
  parameters: {
    backgrounds: { default: "light" },
  },
};

export const Silver: StoryObj<typeof UserColumn> = {
  args: { rank: 2, user: "g1j0q...8auvm" },
  parameters: {
    backgrounds: { default: "light" },
  },
};

export const Bronze: StoryObj<typeof UserColumn> = {
  args: { rank: 3, user: "g1j0q...8auvm" },
  parameters: {
    backgrounds: { default: "light" },
  },
};
