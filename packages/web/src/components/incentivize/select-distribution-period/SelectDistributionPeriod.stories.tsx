import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import SelectDistributionPeriod from "./SelectDistributionPeriod";
import { action } from '@storybook/addon-actions';

export default {
  title: "incentivize/SelectDistributionPeriod",
  component: SelectDistributionPeriod,
} as ComponentMeta<typeof SelectDistributionPeriod>;

const Template: ComponentStory<typeof SelectDistributionPeriod> = args => (
  <SelectDistributionPeriod {...args} />
);

export const Default = Template.bind({});
Default.args = {
  startDate: {
    year: 2023,
    month: 10,
    date: 1
  },
  setStartDate: action("start date"),
  setEndDate: action("end date"),
};
