import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import TvlChartSelectTab from "./TvlChartSelectTab";
import { ACTIVITY_TYPE } from "@containers/dashboard-activities-container/DashboardActivitiesContainer";
import { CHART_TYPE } from "@constants/option.constant";

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
