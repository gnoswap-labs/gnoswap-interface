import type { Meta, StoryObj } from "@storybook/nextjs";

import HighestAprsCardList from "./HighestAprsCardList";

const meta = {
  title: "home/HighestAprsCardList",
  component: HighestAprsCardList,
  tags: ["autodocs"],
} satisfies Meta<typeof HighestAprsCardList>;

export default meta;
type Story = StoryObj<typeof HighestAprsCardList>;

export const Default: Story = {
  args: {
    list: [],
  },
};
