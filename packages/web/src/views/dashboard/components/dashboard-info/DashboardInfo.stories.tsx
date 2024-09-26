import { css, Theme } from "@emotion/react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { DEVICE_TYPE } from "@styles/media";
import DashboardInfo from "./DashboardInfo";

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
  governanceOverviewInfo: {
    totalDelegated: "-",
    holders: "-",
    passedCount: "-",
    activeCount: "-",
    communityPool: "-",
  },
  breakpoint: DEVICE_TYPE.WEB,
};

const wrapper = (theme: Theme) => css`
  color: ${theme.color.text02};
`;
