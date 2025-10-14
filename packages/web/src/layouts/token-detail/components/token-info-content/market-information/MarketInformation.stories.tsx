import type { Meta, StoryObj } from "@storybook/nextjs";

import MarketInformation from "./MarketInformation";
import { marketInformationInit } from "./market-information-list/MarketInformationList";

const meta = {
  title: "token/MarketInformation",
  component: MarketInformation,
  tags: ["autodocs"],
} satisfies Meta<typeof MarketInformation>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof MarketInformation>]?: React.ComponentProps<typeof MarketInformation>[K];
}>;

export const Default: Story = {
  args: {
    info: marketInformationInit,
  },
};
