import { action } from "@storybook/addon-actions";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { dummyActivityData } from "@repositories/activity/responses/activity-responses";
import { DEVICE_TYPE } from "@styles/media";

import ActivityListTable from "./ActivityListTable";

const dummyTokenList = [dummyActivityData];

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
  breakpoint: DEVICE_TYPE.WEB,
};

export const Skeleton = Template.bind({});
Skeleton.args = {
  activities: [],
  isFetched: false,
  isSortOption: () => true,
  sort: action("sort"),
  breakpoint: DEVICE_TYPE.WEB,
};

export const NotFount = Template.bind({});
NotFount.args = {
  activities: [],
  isFetched: true,
  isSortOption: () => true,
  sort: action("sort"),
  breakpoint: DEVICE_TYPE.WEB,
};
