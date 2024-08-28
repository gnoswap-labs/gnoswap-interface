import { action } from "@storybook/addon-actions";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import GetProposalsResponseMock from "@repositories/governance/mock/get-proposals-response.json";
import { DEVICE_TYPE } from "@styles/media";

import ViewProposalModal from "./ViewProposalModal";

export default {
  title: "governance/ViewProposalModal",
  component: ViewProposalModal,
} as ComponentMeta<typeof ViewProposalModal>;

const Template: ComponentStory<typeof ViewProposalModal> = args => (
  <ViewProposalModal {...args} />
);

export const Default = Template.bind({});
Default.args = {
  breakpoint: DEVICE_TYPE.WEB,
  proposalDetail: GetProposalsResponseMock[0],
  setSelectedProposalId: action("setSelectedProposalId"),
};
