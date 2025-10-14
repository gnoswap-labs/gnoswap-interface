import React from "react";
import { css, Theme } from "@emotion/react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";
import { ActivityData, dummyActivityData } from "@repositories/activity/responses/activity-responses";
import { ActivityType } from "@repositories/dashboard";
import { DEVICE_TYPE } from "@styles/media";
import ActivityList from "./ActivityList";

const dummyTokenList: ActivityData[] = [dummyActivityData];

const meta = {
  title: "dashboard/ActivityList",
  component: ActivityList,
  tags: ["autodocs"],
} satisfies Meta<typeof ActivityList>;

export default meta;
type Story = StoryObj<typeof ActivityList>;

export const Default: Story = {
  render: (args: React.ComponentProps<typeof ActivityList>) => (
    <div css={wrapper}>
      <ActivityList {...args} />
    </div>
  ),
  args: {
    activities: dummyTokenList,
    isFetched: true,
    error: null,
    activityType: ActivityType.ALL,
    changeActivityType: fn(),
    currentPage: 0,
    totalPage: 10,
    movePage: fn(),
    isSortOption: () => true,
    sort: fn(),
    breakpoint: DEVICE_TYPE.WEB,
  },
};

const wrapper = (theme: Theme) => css`
  color: ${theme.color.text02};
`;
