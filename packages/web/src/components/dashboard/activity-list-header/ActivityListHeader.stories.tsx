import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import ActivityListHeader from "./ActivityListHeader";
import { ACTIVITY_TYPE } from "@containers/dashboard-activities-container/DashboardActivitiesContainer";

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
