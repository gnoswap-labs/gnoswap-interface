import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import PricePerformance from "./PricePerformance";
import { performanceInit } from "./price-performance-list/PricePerformanceList";

export default {
  title: "token/PricePerformance",
  component: PricePerformance,
} as ComponentMeta<typeof PricePerformance>;

const Template: ComponentStory<typeof PricePerformance> = args => (
  <PricePerformance {...args} />
);

export const Default = Template.bind({});
Default.args = {
  info: performanceInit,
};
