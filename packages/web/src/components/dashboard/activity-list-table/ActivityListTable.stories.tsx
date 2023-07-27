import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { dummyTokenList } from "@containers/dashboard-activities-container/DashboardActivitiesContainer";
import ActivityListTable from "./ActivityListTable";

export default {
  title: "dashboard/ActivityListTable",
  component: ActivityListTable,
} as ComponentMeta<typeof ActivityListTable>;

const Template: ComponentStory<typeof ActivityListTable> = args => (
  <ActivityListTable {...args} />
);

export const Default = Template.bind({});
Default.args = {
  activities: dummyTokenList,
  isFetched: true,
  isSortOption: () => true,
  sort: action("sort"),
};

export const Skeleton = Template.bind({});
Skeleton.args = {
  activities: [],
  isFetched: false,
  isSortOption: () => true,
  sort: action("sort"),
};

export const NotFount = Template.bind({});
NotFount.args = {
  activities: [],
  isFetched: true,
  isSortOption: () => true,
  sort: action("sort"),
};
