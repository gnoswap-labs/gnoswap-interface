import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import DashboardInfo from "./DashboardInfo";
import { css, Theme } from "@emotion/react";
import { DEVICE_TYPE } from "@styles/media";

export default {
  title: "dashboard/DashboardInfo",
  component: DashboardInfo,
} as ComponentMeta<typeof DashboardInfo>;

const Template: ComponentStory<typeof DashboardInfo> = args => (
  <div css={wrapper}>
    <DashboardInfo {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
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
  governenceOverviewInfo: {
    totalXgnosIssued: "59,144,225 xGNOS",
    holders: "14,072",
    passedProposals: "125",
    activeProposals: "2",
    communityPool: "2,412,148 GNOS",
  },
  breakpoint: DEVICE_TYPE.WEB,
};

const wrapper = (theme: Theme) => css`
  color: ${theme.color.text02};
`;
