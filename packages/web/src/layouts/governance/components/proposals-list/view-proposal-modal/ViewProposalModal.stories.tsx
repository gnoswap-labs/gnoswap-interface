import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";

import { DEVICE_TYPE } from "@styles/media";

import ViewProposalModal from "./ViewProposalModal";

const meta = {
  title: "governance/ViewProposalModal",
  component: ViewProposalModal,
  tags: ["autodocs"],
} satisfies Meta<typeof ViewProposalModal>;

export default meta;
type Story = StoryObj<typeof ViewProposalModal>;

export const Default: Story = {
  args: {
    breakpoint: DEVICE_TYPE.WEB,
    setIsModalOpen: fn(),
  },
};
