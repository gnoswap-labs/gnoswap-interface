import { ComponentMeta, ComponentStory } from "@storybook/react";
import GetProposalsResponseMock from "@repositories/governance/mock/get-proposals-response.json";

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
  proposalDetail: GetProposalsResponseMock[0]
};
