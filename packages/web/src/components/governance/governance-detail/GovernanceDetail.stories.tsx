import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import GovernanceDetail from "./GovernanceDetail";

export default {
  title: "governance/GovernanceDetail",
  component: GovernanceDetail,
} as ComponentMeta<typeof GovernanceDetail>;

const Template: ComponentStory<typeof GovernanceDetail> = (args) => (
  <GovernanceDetail {...args} />
);

export const Default = Template.bind({});
Default.args = {
  governanceDetailInfo: {
    totalXGnosIssued: "0 xGNOS",
    communityPool: "0 GNOS",
    passedProposals: "0",
    activeProposals: "0",
  },
};
