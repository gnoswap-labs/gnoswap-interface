import type { Meta, StoryObj } from "@storybook/nextjs";

import PriceInformation from "./PriceInformation";
import { priceInfomationInit } from "./price-information-list/PriceInformationList";

const meta = {
  title: "token/PriceInformation",
  component: PriceInformation,
  tags: ["autodocs"],
} satisfies Meta<typeof PriceInformation>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof PriceInformation>]?: React.ComponentProps<typeof PriceInformation>[K];
}>;

export const Default: Story = {
  args: {
    info: priceInfomationInit,
  },
};
