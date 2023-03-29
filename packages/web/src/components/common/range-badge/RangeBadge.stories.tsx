import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import RangeBadge from "./RangeBadge";
import { RANGE_STATUS_OPTION } from "@constants/option.constant";

export default {
  title: "common/RangeBadge",
  component: RangeBadge,
  argTypes: {
    status: {
      options: ["IN", "OUT"],
      control: { type: "radio" },
    },
  },
} as ComponentMeta<typeof RangeBadge>;

const Template: ComponentStory<typeof RangeBadge> = args => (
  <RangeBadge {...args} />
);

export const Default = Template.bind({});
Default.args = {
  status: RANGE_STATUS_OPTION.IN,
};
