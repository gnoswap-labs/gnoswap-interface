import { action } from "@storybook/addon-actions";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import GetProposals2ResponseMock from "@repositories/governance/mock/get-proposals2-response.json";
import { DEVICE_TYPE } from "@styles/media";
import { Proposal2ItemInfo } from "@repositories/governance";

import ViewProposalModal from "./ViewProposalModal";

export default {
  title: "governance/ViewProposalModal",
  component: ViewProposalModal,
} as ComponentMeta<typeof ViewProposalModal>;

const Template: ComponentStory<typeof ViewProposalModal> = args => <ViewProposalModal {...args} />;

export const Default = Template.bind({});
Default.args = {
  breakpoint: DEVICE_TYPE.WEB,
  proposalDetail: GetProposals2ResponseMock.proposals[0] as Proposal2ItemInfo,
  setIsModalOpen: action("setIsModalOpen"),
};
