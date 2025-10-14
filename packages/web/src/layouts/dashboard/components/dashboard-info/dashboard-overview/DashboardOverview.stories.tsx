import React from "react";
import { css, Theme } from "@emotion/react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { DEVICE_TYPE } from "@styles/media";
import DashboardOverview from "./DashboardOverview";

const meta = {
  title: "dashboard/DashboardOverview",
  component: DashboardOverview,
  tags: ["autodocs"],
} satisfies Meta<typeof DashboardOverview>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof DashboardOverview>]: K extends "children"
    ? React.ReactNode
    : React.ComponentProps<typeof DashboardOverview>[K];
}>;

export const Default: Story = {
  render: (args: React.ComponentProps<typeof DashboardOverview>) => (
    <div css={wrapper}>
      <DashboardOverview {...args} />
    </div>
  ),
  args: {
    breakpoint: DEVICE_TYPE.WEB,
    supplyOverviewInfo: {
      totalSupply: "1,000,000,000 GNOS",
      circulatingSupply: "218,184,885 GNOS",
      progressBar: "580 GNOS",
      dailyBlockEmissions: "580 GNOS",
      totalStaked: "152,412,148 GNOS",
      stakingRatio: "55.15%",
      dailyBlockEmissionsInfo: {
        liquidityStaking: "580 GNOS",
        devOps: "580 GNOS",
        community: "580 GNOS",
      },
    },
    governanceOverviewInfo: {
      totalDelegated: "-",
      holders: "-",
      passedCount: "-",
      activeCount: "-",
      communityPool: "-",
    },
  },
};

const wrapper = (theme: Theme) => css`
  color: ${theme.color.text02};
`;
