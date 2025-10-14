import type { Meta, StoryObj } from "@storybook/nextjs";

import { gainersInit } from "./gainer-card-list/GainerCardList.stories";
import GainerAndLoser from "./GainerAndLoser";
import { losersInit } from "./loser-card-list/LoserCardList.stories";

const meta = {
  title: "token/GainerAndLoser",
  component: GainerAndLoser,
  tags: ["autodocs"],
} satisfies Meta<typeof GainerAndLoser>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof GainerAndLoser>]?: React.ComponentProps<typeof GainerAndLoser>[K];
}>;

export const Default: Story = {
  args: {
    gainers: gainersInit,
    losers: losersInit,
  },
};
