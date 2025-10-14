import type { Meta, StoryObj } from "@storybook/nextjs";

import PricePerformanceList, { performanceInit } from "./PricePerformanceList";

const meta = {
  title: "token/PricePerformanceList",
  component: PricePerformanceList,
  tags: ["autodocs"],
} satisfies Meta<typeof PricePerformanceList>;

export default meta;
type Story = StoryObj<typeof PricePerformanceList>;

export const Default: Story = {
  args: {
    list: performanceInit,
  },
};
