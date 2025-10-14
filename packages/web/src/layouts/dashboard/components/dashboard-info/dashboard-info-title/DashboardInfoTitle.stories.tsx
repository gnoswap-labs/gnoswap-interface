import React from "react";
import { css, Theme } from "@emotion/react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { DEVICE_TYPE } from "@styles/media";
import DashboardInfoTitle from "./DashboardInfoTitle";

const meta = {
  title: "dashboard/DashboardInfoTitle",
  component: DashboardInfoTitle,
  tags: ["autodocs"],
} satisfies Meta<typeof DashboardInfoTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args: React.ComponentProps<typeof DashboardInfoTitle>) => (
    <div css={wrapper}>
      <DashboardInfoTitle {...args} />
    </div>
  ),
  args: {
    dashboardTokenInfo: {
      gnosAmount: "$0.7425",
      gnotAmount: "$1.8852",
    },
    breakpoint: DEVICE_TYPE.WEB,
  },
};

const wrapper = (theme: Theme) => css`
  color: ${theme.color.text02};
`;
