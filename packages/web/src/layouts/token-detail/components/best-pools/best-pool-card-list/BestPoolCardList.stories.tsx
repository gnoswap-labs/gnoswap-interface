import type { Meta, StoryObj } from "@storybook/nextjs";

import BestPoolCardList from "./BestPoolCardList";

const meta = {
  title: "token/BestPoolCardList",
  component: BestPoolCardList,
  tags: ["autodocs"],
} satisfies Meta<typeof BestPoolCardList>;

export default meta;
type Story = StoryObj<typeof BestPoolCardList>;

export const Default: Story = {
  args: {
    list: [],
  },
};
