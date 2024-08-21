import { action } from "@storybook/addon-actions";
import { ComponentMeta, ComponentStory } from "@storybook/react";

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
