import type { Meta, StoryObj } from "@storybook/nextjs";

import TokenInfoContent from "./TokenInfoContent";
import { marketInformationInit } from "./market-information/market-information-list/MarketInformationList";
import { performanceInit } from "./price-performance/price-performance-list/PricePerformanceList";
import { priceInfomationInit } from "./price-information/price-information-list/PriceInformationList";

const meta = {
  title: "token/TokenInfoContent",
  component: TokenInfoContent,
  tags: ["autodocs"],
} satisfies Meta<typeof TokenInfoContent>;

export default meta;
type Story = StoryObj<typeof TokenInfoContent>;

export const Default: Story = {
  args: {
    performance: performanceInit,
    priceInfo: priceInfomationInit,
    marketInfo: marketInformationInit,
  },
};
