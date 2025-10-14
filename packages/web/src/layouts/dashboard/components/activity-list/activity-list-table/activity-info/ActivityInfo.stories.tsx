import React from "react";
import { css, Theme } from "@emotion/react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { dummyActivityData } from "@repositories/activity/responses/activity-responses";
import ActivityInfo from "./ActivityInfo";

const meta = {
  title: "dashboard/ActivityInfo",
  component: ActivityInfo,
  tags: ["autodocs"],
} satisfies Meta<typeof ActivityInfo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args: React.ComponentProps<typeof ActivityInfo>) => (
    <div css={wrapper}>
      <ActivityInfo {...args} />
    </div>
  ),
  args: {
    item: dummyActivityData,
  },
};

const wrapper = (theme: Theme) => css`
  color: ${theme.color.text02};
`;
