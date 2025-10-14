import type { Meta, StoryObj } from "@storybook/nextjs";

import RecentlyAddedCardList from "./RecentlyAddedCardList";

const meta = {
  title: "home/RecentlyAddedCardList",
  component: RecentlyAddedCardList,
  tags: ["autodocs"],
} satisfies Meta<typeof RecentlyAddedCardList>;

export default meta;
type Story = StoryObj<typeof RecentlyAddedCardList>;

export const Default: Story = {
  args: {
    list: [],
  },
};
