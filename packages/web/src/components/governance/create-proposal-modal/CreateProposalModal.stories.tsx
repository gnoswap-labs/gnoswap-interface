import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import CreateProposalModal from "./CreateProposalModal";
import { action } from "@storybook/addon-actions";
import { DEVICE_TYPE } from "@styles/media";

export default {
  title: "governance/CreateProposalModal",
  component: CreateProposalModal,
} as ComponentMeta<typeof CreateProposalModal>;

const Template: ComponentStory<typeof CreateProposalModal> = args => (
  <CreateProposalModal {...args} />
);

export const Default = Template.bind({});
Default.args = {
  breakpoint: DEVICE_TYPE.WEB,
  setIsShowCreateProposal: action("setIsShowCreateProposal"),
};
