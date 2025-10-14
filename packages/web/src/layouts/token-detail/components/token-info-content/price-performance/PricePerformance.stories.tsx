import type { Meta, StoryObj } from "@storybook/nextjs";

import { performanceInit } from "./price-performance-list/PricePerformanceList";
import PricePerformance from "./PricePerformance";

const meta = {
  title: "token/PricePerformance",
  component: PricePerformance,
  tags: ["autodocs"],
} satisfies Meta<typeof PricePerformance>;

export default meta;
type Story = StoryObj<typeof PricePerformance>;

export const Default: Story = {
  args: {
    info: performanceInit,
  },
};
