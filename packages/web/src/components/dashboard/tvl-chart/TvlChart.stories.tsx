import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import TvlChart from "./TvlChart";
import { CHART_TYPE } from "@constants/option.constant";

export default {
  title: "dashboard/TvlChart",
  component: TvlChart,
} as ComponentMeta<typeof TvlChart>;

function createData(num: number) {
  return {
    amount: {
      value: `${num}`,
      denom: "UTC",
    },
    time: `${num}`,
  }
}

const Template: ComponentStory<typeof TvlChart> = args => (
  <TvlChart {...args} />
);

export const Default = Template.bind({});
Default.args = {
  tvlChartType: CHART_TYPE["7D"],
  changeTvlChartType: action("changeTvlChartType"),
  tvlPriceInfo: { amount: "$100,450,000" },
  tvlChartDatas: [
    createData(1),
    createData(2),
    createData(3),
    createData(4),
    createData(5),
  ]
};
