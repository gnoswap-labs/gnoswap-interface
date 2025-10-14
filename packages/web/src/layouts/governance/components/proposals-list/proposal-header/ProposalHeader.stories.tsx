import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";

import ProposalHeader from "./ProposalHeader";

const meta = {
  title: "governance/ProposalHeader",
  component: ProposalHeader,
  tags: ["autodocs"],
} satisfies Meta<typeof ProposalHeader>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof ProposalHeader>]?: React.ComponentProps<typeof ProposalHeader>[K];
}>;

export const Default: Story = {
  args: {
    isShowActiveOnly: true,
    toggleIsShowActiveOnly: fn(),
  },
};
