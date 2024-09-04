import TokenChartGraph, { type TokenChartGraphProps } from "./TokenChartGraph";
import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "token/TokenChartGraph",
  component: TokenChartGraph,
} as Meta<typeof TokenChartGraph>;

function createData(num: number) {
  return {
    amount: {
      value: `${num}`,
      denom: "UTC",
    },
    time: `${num}`,
  };
}

export const Default: StoryObj<TokenChartGraphProps> = {
  args: {
    datas: [
      createData(1),
      createData(2),
      createData(3),
      createData(4),
      createData(5),
    ],
    xAxisLabels: ["1", "2", "3", "4", "5"],
    yAxisLabels: ["1", "2", "3", "4", "5"],
  },
};