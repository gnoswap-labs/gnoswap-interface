import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import PricePerformanceList from "./PricePerformanceList";
import { performanceInit } from "@containers/token-info-content-container/TokenInfoContentContainer";

export default {
  title: "token/PricePerformanceList",
  component: PricePerformanceList,
} as ComponentMeta<typeof PricePerformanceList>;

const Template: ComponentStory<typeof PricePerformanceList> = args => (
  <PricePerformanceList {...args} />
);

export const Default = Template.bind({});
Default.args = {
  list: performanceInit,
};
