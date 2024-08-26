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
    totalXGnosIssued: "59,144,225 xGNOS",
    communityPool: "2,412,148 GNOS",
    passedProposals: "42",
    activeProposals: "2",
  },
};
