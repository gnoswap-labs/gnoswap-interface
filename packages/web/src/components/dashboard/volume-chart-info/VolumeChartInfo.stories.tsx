import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import VolumeChartInfo from "./VolumeChartInfo";

export default {
  title: "dashboard/VolumeChartInfo",
  component: VolumeChartInfo,
} as ComponentMeta<typeof VolumeChartInfo>;

const Template: ComponentStory<typeof VolumeChartInfo> = args => (
  <VolumeChartInfo {...args} />
);

export const Default = Template.bind({});
Default.args = {};
