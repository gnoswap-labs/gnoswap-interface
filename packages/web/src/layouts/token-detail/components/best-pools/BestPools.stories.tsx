import type { Meta, StoryObj } from "@storybook/nextjs";

import BestPools from "./BestPools";

const meta = {
  title: "token/BestPools",
  component: BestPools,
  tags: ["autodocs"],
} satisfies Meta<typeof BestPools>;

export default meta;
type Story = StoryObj<typeof BestPools>;

export const Default: Story = {
  args: {
    titleSymbol: "GNS",
    cardList: [],
  },
};
