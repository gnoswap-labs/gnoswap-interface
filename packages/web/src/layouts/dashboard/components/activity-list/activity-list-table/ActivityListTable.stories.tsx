import React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";
import { dummyActivityData } from "@repositories/activity/responses/activity-responses";
import { DEVICE_TYPE } from "@styles/media";
import ActivityListTable from "./ActivityListTable";

const dummyTokenList = [dummyActivityData];

const meta = {
  title: "dashboard/ActivityListTable",
  component: ActivityListTable,
  tags: ["autodocs"],
} satisfies Meta<typeof ActivityListTable>;

export default meta;
type Story = StoryObj<typeof ActivityListTable>;

export const Default: Story = {
  render: (args: React.ComponentProps<typeof ActivityListTable>) => <ActivityListTable {...args} />,
  args: {
    activities: dummyTokenList,
    isFetched: true,
    isSortOption: () => true,
    sort: fn(),
    breakpoint: DEVICE_TYPE.WEB,
  },
};

export const Skeleton: Story = {
  render: (args: React.ComponentProps<typeof ActivityListTable>) => <ActivityListTable {...args} />,
  args: {
    activities: [],
    isFetched: false,
    isSortOption: () => true,
    sort: fn(),
    breakpoint: DEVICE_TYPE.WEB,
  },
};

export const NotFound: Story = {
  render: (args: React.ComponentProps<typeof ActivityListTable>) => <ActivityListTable {...args} />,
  args: {
    activities: [],
    isFetched: true,
    isSortOption: () => true,
    sort: fn(),
    breakpoint: DEVICE_TYPE.WEB,
  },
};
