import React from "react";
import { css, Theme } from "@emotion/react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { DEVICE_TYPE } from "@styles/media";
import DashboardInfo from "./DashboardInfo";

const meta = {
  title: "dashboard/DashboardInfo",
  component: DashboardInfo,
  tags: ["autodocs"],
} satisfies Meta<typeof DashboardInfo>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof DashboardInfo>]: K extends "children"
    ? React.ReactNode
    : React.ComponentProps<typeof DashboardInfo>[K];
}>;

export const Default: Story = {
  render: (args: React.ComponentProps<typeof DashboardInfo>) => (
    <div css={wrapper}>
      <DashboardInfo {...args} />
    </div>
  ),
  args: {
    dashboardTokenInfo: {
      gnosAmount: "$0.7425",
      gnotAmount: "$1.8852",
    },
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
    breakpoint: DEVICE_TYPE.WEB,
  },
};

const wrapper = (theme: Theme) => css`
  color: ${theme.color.text02};
`;
