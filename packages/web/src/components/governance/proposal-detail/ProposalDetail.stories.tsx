import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import ProposalDetail from "./ProposalDetail";

export default {
  title: "governance/ProposalDetail",
  component: ProposalDetail,
} as ComponentMeta<typeof ProposalDetail>;

const Template: ComponentStory<typeof ProposalDetail> = (args) => (
  <ProposalDetail {...args} />
);

export const Default = Template.bind({});
Default.args = {
  proposalDetail: {
    id: "1",
    title: "#7 Proposal Title",
    label: "Community Pool Spend",
    status: "ACTIVE",
    timeEnd: "Voting Ends in 9 hours (2023-08-01, 12:00:00 UTC+9)",
    abstainOfQuorum: "70%",
    noOfQuorum: "60%",
    yesOfQuorum: "50%",
    currentValue: "38,222,333",
    maxValue: "40,000,000",
  },
};
