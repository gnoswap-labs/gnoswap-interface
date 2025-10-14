import type { Meta, StoryObj } from "@storybook/nextjs";

import MarketInformationList, { marketInformationInit } from "./MarketInformationList";

const meta = {
  title: "token/MarketInformationList",
  component: MarketInformationList,
  tags: ["autodocs"],
} satisfies Meta<typeof MarketInformationList>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof MarketInformationList>]?: React.ComponentProps<
    typeof MarketInformationList
  >[K];
}>;

export const Default: Story = {
  args: {
    list: marketInformationInit,
  },
};
