import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import ProposalHeader from "./ProposalHeader";
import { action } from "@storybook/addon-actions";

export default {
  title: "governance/ProposalHeader",
  component: ProposalHeader,
} as ComponentMeta<typeof ProposalHeader>;

const Template: ComponentStory<typeof ProposalHeader> = (args) => (
  <ProposalHeader {...args} />
);

export const Default = Template.bind({});
Default.args = {
  isShowCancelled: true,
  toggleShowCancelled: action(),
};
