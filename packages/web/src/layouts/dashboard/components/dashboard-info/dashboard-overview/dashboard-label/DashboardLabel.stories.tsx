import React from "react";
import { css, Theme } from "@emotion/react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import DashboardLabel from "./DashboardLabel";

const meta = {
  title: "dashboard/DashboardLabel",
  component: DashboardLabel,
  tags: ["autodocs"],
} satisfies Meta<typeof DashboardLabel>;

export default meta;
type Story = StoryObj<typeof DashboardLabel>;

export const Default: Story = {
  render: (args: React.ComponentProps<typeof DashboardLabel>) => (
    <div css={wrapper}>
      <DashboardLabel {...args} />
    </div>
  ),
  args: {
    tooltip: "The total supply of GNOS tokens is 1,000,000,000 GNOS.",
  },
};

const wrapper = (theme: Theme) => css`
  color: ${theme.color.text02};
`;
