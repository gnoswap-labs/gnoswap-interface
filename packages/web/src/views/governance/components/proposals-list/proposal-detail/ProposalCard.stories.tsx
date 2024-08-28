import { ComponentMeta, ComponentStory } from "@storybook/react";
import GetProposalsResponseMock from "@repositories/governance/mock/get-proposals-response.json";

import ProposalCard from "./ProposalCard";

export default {
  title: "governance/ProposalCard",
  component: ProposalCard,
} as ComponentMeta<typeof ProposalCard>;

const Template: ComponentStory<typeof ProposalCard> = (args) => (
  <ProposalCard {...args} />
);

export const Default = Template.bind({});
Default.args = {
  proposalDetail: GetProposalsResponseMock[0]
};
