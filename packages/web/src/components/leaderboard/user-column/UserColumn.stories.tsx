import UserColumn from "./UserColumn";
import { ComponentMeta, StoryObj } from "@storybook/react";

export default {
  title: "leaderboard/UserColumn",
  component: UserColumn,
} as ComponentMeta<typeof UserColumn>;

export const Gold: StoryObj<typeof UserColumn> = {
  args: {
    rank: 1,
    user: "g112...xnf5",
    address: "g1122u9x3d2p11mlqm3yrzqijqnee5oni2l7xnf5",
    hide: true,
    me: false,
  },
  parameters: {
    backgrounds: { default: "light" },
  },
};

export const Silver: StoryObj<typeof UserColumn> = {
  args: {
    rank: 2,
    user: "g112...xnf5",
    address: "g1122u9x3d2p11mlqm3yrzqijqnee5oni2l7xnf5",
    hide: true,
    me: false,
  },
  parameters: {
    backgrounds: { default: "light" },
  },
};

export const Bronze: StoryObj<typeof UserColumn> = {
  args: {
    rank: 3,
    user: "g112...xnf5",
    address: "g1122u9x3d2p11mlqm3yrzqijqnee5oni2l7xnf5",
    hide: true,
    me: false,
  },
  parameters: {
    backgrounds: { default: "light" },
  },
};
