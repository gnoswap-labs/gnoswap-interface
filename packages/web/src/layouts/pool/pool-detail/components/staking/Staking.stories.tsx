import type { Meta, StoryObj } from "@storybook/nextjs";

import { DEVICE_TYPE } from "@styles/media";

import Staking from "./Staking";

const meta = {
  title: "pool/Staking",
  component: Staking,
  tags: ["autodocs"],
} satisfies Meta<typeof Staking>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof Staking>]?: React.ComponentProps<typeof Staking>[K];
}>;

export const Default: Story = {
  args: {
    breakpoint: DEVICE_TYPE.WEB,
    mobile: false,
  },
};
