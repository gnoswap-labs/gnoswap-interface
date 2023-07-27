import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import TvlChartInfo from "./TvlChartInfo";
import { CHART_TYPE } from "@constants/option.constant";

export default {
  title: "dashboard/TvlChartInfo",
  component: TvlChartInfo,
} as ComponentMeta<typeof TvlChartInfo>;

const Template: ComponentStory<typeof TvlChartInfo> = args => (
  <TvlChartInfo {...args} />
);

export const Default = Template.bind({});
Default.args = {};
