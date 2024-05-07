import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import VolumeChartSelectTabV2 from "./ChartScopeSelectTab";
import { ACTIVITY_TYPE } from "@containers/dashboard-activities-container/DashboardActivitiesContainer";
import { CHART_TYPE } from "@constants/option.constant";
import ChartScopeSelectTab from "./ChartScopeSelectTab";

export default {
  title: "earn/ChartScopeSelectTab",
  component: ChartScopeSelectTab,
} as ComponentMeta<typeof ChartScopeSelectTab>;

const Template: ComponentStory<typeof ChartScopeSelectTab> = args => (
  <ChartScopeSelectTab {...args} />
);

export const Default = Template.bind({});
Default.args = {
  selected: CHART_TYPE["7D"],
  onChange: action("changeVolumeChartType"),
};
