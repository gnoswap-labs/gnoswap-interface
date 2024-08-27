import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import GovernanceSummary from "./GovernanceSummary";

export default {
  title: "governance/GovernanceSummary",
  component: GovernanceSummary,
} as ComponentMeta<typeof GovernanceSummary>;

const Template: ComponentStory<typeof GovernanceSummary> = (args) => (
  <GovernanceSummary {...args} />
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
