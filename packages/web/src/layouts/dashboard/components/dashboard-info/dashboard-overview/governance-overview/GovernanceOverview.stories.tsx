import React from "react";
import { css, Theme } from "@emotion/react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import GovernanceOverview from "./GovernanceOverview";

const meta = {
  title: "dashboard/GovernanceOverview",
  component: GovernanceOverview,
  tags: ["autodocs"],
} satisfies Meta<typeof GovernanceOverview>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof GovernanceOverview>]: K extends "children"
    ? React.ReactNode
    : React.ComponentProps<typeof GovernanceOverview>[K];
}>;

export const Default: Story = {
  render: (args: React.ComponentProps<typeof GovernanceOverview>) => (
    <div css={wrapper}>
      <GovernanceOverview {...args} />
    </div>
  ),
  args: {
    governanceOverviewInfo: {
      totalDelegated: "59,144,225 xGNOS",
      holders: "14,072",
      passedCount: "125",
      activeCount: "2",
      communityPool: "2,412,148 GNOS",
    },
  },
};

const wrapper = (theme: Theme) => css`
  color: ${theme.color.text02};
`;
