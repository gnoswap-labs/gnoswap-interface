import React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";
import { ActivityType } from "@repositories/dashboard";
import ActivityListHeader from "./ActivityListHeader";

const meta = {
  title: "dashboard/ActivityListHeader",
  component: ActivityListHeader,
  tags: ["autodocs"],
} satisfies Meta<typeof ActivityListHeader>;

export default meta;
type Story = StoryObj<typeof ActivityListHeader>;

export const Default: Story = {
  render: (args: React.ComponentProps<typeof ActivityListHeader>) => <ActivityListHeader {...args} />,
  args: {
    activityType: ActivityType.ALL,
    changeActivityType: fn(),
  },
};
