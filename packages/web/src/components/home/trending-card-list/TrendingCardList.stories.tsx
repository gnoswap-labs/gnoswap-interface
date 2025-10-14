import type { Meta, StoryObj } from "@storybook/nextjs";

import TrendingCardList from "./TrendingCardList";

const meta = {
  title: "home/TrendingCardList",
  component: TrendingCardList,
  tags: ["autodocs"],
} satisfies Meta<typeof TrendingCardList>;

export default meta;
type Story = StoryObj<typeof TrendingCardList>;

export const Default: Story = {
  args: {
    list: [],
  },
};
