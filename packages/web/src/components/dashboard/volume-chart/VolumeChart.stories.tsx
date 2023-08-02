import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import VolumeChart from "./VolumeChart";
import { CHART_TYPE } from "@constants/option.constant";

export default {
  title: "dashboard/VolumeChart",
  component: VolumeChart,
} as ComponentMeta<typeof VolumeChart>;

const Template: ComponentStory<typeof VolumeChart> = args => (
  <VolumeChart {...args} />
);

export const Default = Template.bind({});
Default.args = {
  volumeChartType: CHART_TYPE["7D"],
  changeVolumeChartType: action("changeVolumeChartType"),
  volumePriceInfo: { amount: "$100,450,000", fee: "$12,231" },
  volumeChartInfo: {
    datas: Array.from({ length: 24 }, (_, index) => `${index + 1}`),
    xAxisLabels: ["09:00", "12:00", "15:00", "18:00", "21:00", "24:00"],
  },
};
