import type { Meta, StoryObj } from "@storybook/nextjs";

import MarketInformation from "./MarketInformation";
import { marketInformationInit } from "./market-information-list/MarketInformationList";

const meta = {
  title: "token/MarketInformation",
  component: MarketInformation,
  tags: ["autodocs"],
} satisfies Meta<typeof MarketInformation>;

export default meta;
type Story = StoryObj<typeof MarketInformation>;

export const Default: Story = {
  args: {
    info: marketInformationInit,
  },
};
