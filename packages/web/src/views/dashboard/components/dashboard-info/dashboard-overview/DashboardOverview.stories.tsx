import { css, Theme } from "@emotion/react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { DEVICE_TYPE } from "@styles/media";
import DashboardOverview from "./DashboardOverview";

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
};

const wrapper = (theme: Theme) => css`
  color: ${theme.color.text02};
`;
