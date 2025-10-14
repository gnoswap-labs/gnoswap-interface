import type { Meta, StoryObj } from "@storybook/nextjs";

import PriceInformation from "./PriceInformation";
import { priceInfomationInit } from "./price-information-list/PriceInformationList";

const meta = {
  title: "token/PriceInformation",
  component: PriceInformation,
  tags: ["autodocs"],
} satisfies Meta<typeof PriceInformation>;

export default meta;
type Story = StoryObj<typeof PriceInformation>;

export const Default: Story = {
  args: {
    info: priceInfomationInit,
  },
};
