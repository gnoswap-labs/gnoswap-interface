import type { Meta, StoryObj } from "@storybook/nextjs";

import PriceInformationList, { priceInfomationInit } from "./PriceInformationList";

const meta = {
  title: "token/PriceInformationList",
  component: PriceInformationList,
  tags: ["autodocs"],
} satisfies Meta<typeof PriceInformationList>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof PriceInformationList>]?: React.ComponentProps<typeof PriceInformationList>[K];
}>;

export const Default: Story = {
  args: {
    list: priceInfomationInit,
  },
};
