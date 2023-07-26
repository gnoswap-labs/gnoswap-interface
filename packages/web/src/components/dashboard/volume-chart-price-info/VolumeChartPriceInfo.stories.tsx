import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import VolumeChartPriceInfo from "./VolumeChartPriceInfo";

export default {
  title: "dashboard/VolumeChartPriceInfo",
  component: VolumeChartPriceInfo,
} as ComponentMeta<typeof VolumeChartPriceInfo>;

const Template: ComponentStory<typeof VolumeChartPriceInfo> = args => (
  <VolumeChartPriceInfo {...args} />
);

export const Default = Template.bind({});
Default.args = {
  volumePriceInfo: { amount: "$100,450,000", fee: "$12,231" },
};
