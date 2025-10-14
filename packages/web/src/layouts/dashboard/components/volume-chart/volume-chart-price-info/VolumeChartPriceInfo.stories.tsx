import type { Meta, StoryObj } from "@storybook/nextjs";
import VolumeChartPriceInfo from "./VolumeChartPriceInfo";

const meta = {
  title: "dashboard/VolumeChartPriceInfo",
  component: VolumeChartPriceInfo,
  tags: ["autodocs"],
} satisfies Meta<typeof VolumeChartPriceInfo>;

export default meta;
type Story = StoryObj<typeof VolumeChartPriceInfo>;

export const Default: Story = {
  args: {
    volumePriceInfo: { amount: "$100,450,000", fee: "$12,231" },
  },
};
