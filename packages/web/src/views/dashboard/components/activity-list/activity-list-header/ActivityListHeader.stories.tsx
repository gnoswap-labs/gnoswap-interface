import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import ActivityListHeader, { ACTIVITY_TYPE } from "./ActivityListHeader";

export default {
  title: "dashboard/ActivityListHeader",
  component: ActivityListHeader,
} as ComponentMeta<typeof ActivityListHeader>;

const Template: ComponentStory<typeof ActivityListHeader> = args => (
  <ActivityListHeader {...args} />
);

export const Default = Template.bind({});
Default.args = {
  activityType: ACTIVITY_TYPE.ALL,
  changeActivityType: action("changeActivityType"),
};
