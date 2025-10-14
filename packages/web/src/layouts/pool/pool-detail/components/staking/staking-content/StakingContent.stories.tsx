import type { Meta, StoryObj } from "@storybook/nextjs";

import { DEVICE_TYPE } from "@styles/media";

import StakingContent from "./StakingContent";

const meta = {
  title: "pool/StakingContent",
  component: StakingContent,
  tags: ["autodocs"],
} satisfies Meta<typeof StakingContent>;

export default meta;
type Story = StoryObj<typeof StakingContent>;

export const Default: Story = {
  args: {
    breakpoint: DEVICE_TYPE.WEB,
    mobile: false,
  },
};
