import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { CHART_TYPE } from "@constants/option.constant";

import VolumeChartSelectTab from "./VolumeChartSelectTab";

export default {
  title: "dashboard/VolumeChartSelectTab",
  component: VolumeChartSelectTab,
} as ComponentMeta<typeof VolumeChartSelectTab>;

const Template: ComponentStory<typeof VolumeChartSelectTab> = args => (
  <VolumeChartSelectTab {...args} />
);

export const Default = Template.bind({});
Default.args = {
  volumeChartType: CHART_TYPE["7D"],
  changeVolumeChartType: action("changeVolumeChartType"),
};
