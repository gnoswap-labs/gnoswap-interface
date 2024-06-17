import TvlChartGraph, { type TvlChartGraphProps } from "./TvlChartGraph";
import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "dashboard/TvlChartGraph",
  component: TvlChartGraph,
} as Meta<typeof TvlChartGraph>;

function createData(num: number) {
  return {
    amount: {
      value: `${num}`,
      denom: "UTC",
    },
    time: `${num}`,
  }
}

export const Default: StoryObj<TvlChartGraphProps> = {
  args: {
    datas: [
      createData(1),
      createData(2),
      createData(3),
      createData(4),
      createData(5),
    ],
    yAxisLabels: ["1", "2", "3", "4", "5"],
  },
};