import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import SelectDistributionPeriod from "./SelectDistributionPeriod";

export default {
  title: "incentivize/SelectDistributionPeriod",
  component: SelectDistributionPeriod,
} as ComponentMeta<typeof SelectDistributionPeriod>;

const Template: ComponentStory<typeof SelectDistributionPeriod> = args => (
  <SelectDistributionPeriod {...args} />
);

export const Default = Template.bind({});
Default.args = {};
