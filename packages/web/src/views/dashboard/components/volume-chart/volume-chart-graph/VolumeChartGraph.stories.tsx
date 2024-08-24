import VolumeChartGraph, { type VolumeChartGraphProps } from "./VolumeChartGraph";
import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "dashboard/VolumeChartGraph",
  component: VolumeChartGraph,
} as Meta<typeof VolumeChartGraph>;

export const Default: StoryObj<VolumeChartGraphProps> = {
  args: {
    datas: Array.from({ length: 24 }, (_, index) => `${index + 1}`),
    xAxisLabels: ["09:00", "12:00", "15:00", "18:00", "21:00", "24:00"],
  },
};