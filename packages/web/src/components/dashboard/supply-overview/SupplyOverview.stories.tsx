import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import SupplyOverview from "./SupplyOverview";
import { css, Theme } from "@emotion/react";

export default {
  title: "dashboard/SupplyOverview",
  component: SupplyOverview,
} as ComponentMeta<typeof SupplyOverview>;

const Template: ComponentStory<typeof SupplyOverview> = args => (
  <div css={wrapper}>
    <SupplyOverview {...args} />
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
    dailyBlockEmissionsInfo: {
      liquidityStaking: "580 GNOS",
      devOps: "580 GNOS",
      community: "580 GNOS",
    },
  },
};

const wrapper = (theme: Theme) => css`
  color: ${theme.color.text02};
`;
