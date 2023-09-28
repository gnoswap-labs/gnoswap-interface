import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import ProposalList from "./ProposalList";
import { action } from "@storybook/addon-actions";
import { createDummyProposalItem } from "@containers/proposal-list-container/ProposalListContainer";

export default {
  title: "governance/ProposalList",
  component: ProposalList,
} as ComponentMeta<typeof ProposalList>;

const Template: ComponentStory<typeof ProposalList> = (args) => (
  <ProposalList {...args} />
);

export const Default = Template.bind({});
Default.args = {
  isShowCancelled: true,
  toggleShowCancelled: action(),
  proposalList: [createDummyProposalItem(), createDummyProposalItem()],
};
