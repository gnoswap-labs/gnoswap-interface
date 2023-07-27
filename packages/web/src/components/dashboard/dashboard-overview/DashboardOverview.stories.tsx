import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import DashboardOverview from "./DashboardOverview";
import { css, Theme } from "@emotion/react";

export default {
  title: "dashboard/DashboardOverview",
  component: DashboardOverview,
} as ComponentMeta<typeof DashboardOverview>;

const Template: ComponentStory<typeof DashboardOverview> = args => (
  <div css={wrapper}>
    <DashboardOverview {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  supplyOverviewInfo: {
    totalSupply: "1,000,000,000 GNOS",
    circulatingSupply: "218,184,885 GNOS",
    progressBar: "580 GNOS",
    dailyBlockEmissions: "580 GNOS",
    totalStaked: "152,412,148 GNOS",
    stakingRatio: "55.15%",
  },
  governenceOverviewInfo: {
    totalXgnosIssued: "59,144,225 xGNOS",
    holders: "14,072",
    passedProposals: "125",
    activeProposals: "2",
    communityPool: "2,412,148 GNOS",
  },
};

const wrapper = (theme: Theme) => css`
  color: ${theme.color.text02};
`;
