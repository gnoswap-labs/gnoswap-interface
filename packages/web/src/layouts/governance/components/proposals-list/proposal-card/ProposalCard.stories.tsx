import type { Meta, StoryObj } from "@storybook/nextjs";

import GetProposals2ResponseMock from "@repositories/governance/mock/get-proposals-response.json";
import { ProposalItemInfo } from "@repositories/governance";

import ProposalCard from "./ProposalCard";

const meta = {
  title: "governance/ProposalCard",
  component: ProposalCard,
  tags: ["autodocs"],
} satisfies Meta<typeof ProposalCard>;

export default meta;
type Story = StoryObj<typeof ProposalCard>;

export const Default: Story = {
  args: {
    proposalDetail: GetProposals2ResponseMock.proposals[0] as ProposalItemInfo,
  },
};
