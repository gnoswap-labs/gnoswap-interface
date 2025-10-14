import type { Meta, StoryObj } from "@storybook/nextjs";
import TvlChartPriceInfo from "./TvlChartPriceInfo";

const meta = {
  title: "dashboard/TvlChartPriceInfo",
  component: TvlChartPriceInfo,
  tags: ["autodocs"],
} satisfies Meta<typeof TvlChartPriceInfo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    tvlPriceInfo: { amount: "$100,450,000" },
  },
};
