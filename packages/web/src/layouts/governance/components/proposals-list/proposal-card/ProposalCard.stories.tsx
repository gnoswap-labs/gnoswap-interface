import { ComponentMeta, ComponentStory } from "@storybook/react";
import GetProposals2ResponseMock from "@repositories/governance/mock/get-proposals2-response.json";
import { Proposal2ItemInfo } from "@repositories/governance";

import ProposalCard from "./ProposalCard";

export default {
  title: "governance/ProposalCard",
  component: ProposalCard,
} as ComponentMeta<typeof ProposalCard>;

const Template: ComponentStory<typeof ProposalCard> = args => <ProposalCard {...args} />;

export const Default = Template.bind({});
Default.args = {
  proposalDetail: GetProposals2ResponseMock.proposals[0] as Proposal2ItemInfo,
};
