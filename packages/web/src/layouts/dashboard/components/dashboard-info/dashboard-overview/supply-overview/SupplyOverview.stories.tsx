import React from "react";
import { css, Theme } from "@emotion/react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import SupplyOverview from "./SupplyOverview";

const meta = {
  title: "dashboard/SupplyOverview",
  component: SupplyOverview,
  tags: ["autodocs"],
} satisfies Meta<typeof SupplyOverview>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof SupplyOverview>]: K extends "children"
    ? React.ReactNode
    : React.ComponentProps<typeof SupplyOverview>[K];
}>;

export const Default: Story = {
  render: (args: React.ComponentProps<typeof SupplyOverview>) => (
    <div css={wrapper}>
      <SupplyOverview {...args} />
    </div>
  ),
  args: {
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
  },
};

const wrapper = (theme: Theme) => css`
  color: ${theme.color.text02};
`;
