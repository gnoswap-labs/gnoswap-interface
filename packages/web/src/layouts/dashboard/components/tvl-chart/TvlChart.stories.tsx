import React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";
import { CHART_TYPE } from "@constants/option.constant";
import TvlChart from "./TvlChart";

const meta = {
  title: "dashboard/TvlChart",
  component: TvlChart,
  tags: ["autodocs"],
} satisfies Meta<typeof TvlChart>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof TvlChart>]?: React.ComponentProps<typeof TvlChart>[K];
}>;

function createData(num: number) {
  return {
    amount: {
      value: `${num}`,
      denom: "UTC",
    },
    time: `${num}`,
  };
}

export const Default: Story = {
  args: {
    tvlChartType: CHART_TYPE["7D"],
    changeTvlChartType: fn(),
    tvlPriceInfo: { amount: "$100,450,000" },
    tvlChartDatas: [createData(1), createData(2), createData(3), createData(4), createData(5)],
  },
};
