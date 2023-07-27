import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import GovernanceOverview from "./GovernanceOverview";
import { css, Theme } from "@emotion/react";

export default {
  title: "dashboard/GovernanceOverview",
  component: GovernanceOverview,
} as ComponentMeta<typeof GovernanceOverview>;

const Template: ComponentStory<typeof GovernanceOverview> = args => (
  <div css={wrapper}>
    <GovernanceOverview {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
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
