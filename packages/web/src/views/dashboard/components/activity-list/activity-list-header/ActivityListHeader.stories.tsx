import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { ActivityType } from "@repositories/dashboard";

import ActivityListHeader from "./ActivityListHeader";

export default {
  title: "dashboard/ActivityListHeader",
  component: ActivityListHeader,
} as ComponentMeta<typeof ActivityListHeader>;

const Template: ComponentStory<typeof ActivityListHeader> = args => (
  <ActivityListHeader {...args} />
);

export const Default = Template.bind({});
Default.args = {
  activityType: ActivityType.ALL,
  changeActivityType: action("changeActivityType"),
};
