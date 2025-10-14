import type { Meta, StoryObj } from "@storybook/nextjs";

import { DEVICE_TYPE } from "@styles/media";

import StakingHeader from "./StakingHeader";

const meta = {
  title: "pool/StakingHeader",
  component: StakingHeader,
  tags: ["autodocs"],
} satisfies Meta<typeof StakingHeader>;

export default meta;
type Story = StoryObj<typeof StakingHeader>;

export const Default: Story = {
  args: {
    breakpoint: DEVICE_TYPE.WEB,
  },
};
