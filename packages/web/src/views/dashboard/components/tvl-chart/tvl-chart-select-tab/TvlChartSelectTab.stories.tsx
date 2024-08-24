import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { CHART_TYPE } from "@constants/option.constant";

import TvlChartSelectTab from "./TvlChartSelectTab";

export default {
  title: "dashboard/TvlChartSelectTab",
  component: TvlChartSelectTab,
} as ComponentMeta<typeof TvlChartSelectTab>;

const Template: ComponentStory<typeof TvlChartSelectTab> = args => (
  <TvlChartSelectTab {...args} />
);

export const Default = Template.bind({});
Default.args = {
  tvlChartType: CHART_TYPE["7D"],
  changeTvlChartType: action("changeTvlChartType"),
};
