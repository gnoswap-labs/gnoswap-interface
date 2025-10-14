import type { Meta, StoryObj } from "@storybook/nextjs";

import BestPoolCardList from "./BestPoolCardList";

const meta = {
  title: "token/BestPoolCardList",
  component: BestPoolCardList,
  tags: ["autodocs"],
} satisfies Meta<typeof BestPoolCardList>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof BestPoolCardList>]?: React.ComponentProps<typeof BestPoolCardList>[K];
}>;

export const Default: Story = {
  args: {
    list: [],
  },
};
