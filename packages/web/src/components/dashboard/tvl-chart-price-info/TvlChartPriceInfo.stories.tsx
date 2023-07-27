import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import TvlChartPriceInfo from "./TvlChartPriceInfo";

export default {
  title: "dashboard/TvlChartPriceInfo",
  component: TvlChartPriceInfo,
} as ComponentMeta<typeof TvlChartPriceInfo>;

const Template: ComponentStory<typeof TvlChartPriceInfo> = args => (
  <TvlChartPriceInfo {...args} />
);

export const Default = Template.bind({});
Default.args = {
  tvlPriceInfo: { amount: "$100,450,000" },
};
