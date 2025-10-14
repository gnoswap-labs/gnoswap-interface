import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";
import { CHART_TYPE } from "@constants/option.constant";
import VolumeChart from "./VolumeChart";

const meta = {
  title: "dashboard/VolumeChart",
  component: VolumeChart,
  tags: ["autodocs"],
} satisfies Meta<typeof VolumeChart>;

export default meta;
type Story = StoryObj<typeof VolumeChart>;

export const Default: Story = {
  args: {
    volumeChartType: CHART_TYPE["7D"],
    changeVolumeChartType: fn(),
    volumePriceInfo: { amount: "$100,450,000", fee: "$12,231" },
    volumeChartInfo: {
      datas: Array.from({ length: 24 }, (_, index) => `${index + 1}`),
      xAxisLabels: ["09:00", "12:00", "15:00", "18:00", "21:00", "24:00"],
      times: [],
      fees: [],
    },
  },
};
