import { css, Theme } from "@emotion/react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import GovernanceOverview from "./GovernanceOverview";

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
  governanceOverviewInfo: {
    totalDelegated: "59,144,225 xGNOS",
    holders: "14,072",
    passedCount: "125",
    activeCount: "2",
    communityPool: "2,412,148 GNOS",
  },
};

const wrapper = (theme: Theme) => css`
  color: ${theme.color.text02};
`;
