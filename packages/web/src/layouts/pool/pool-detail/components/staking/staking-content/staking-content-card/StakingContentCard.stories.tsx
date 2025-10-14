import type { Meta, StoryObj } from "@storybook/nextjs";

import { DEVICE_TYPE } from "@styles/media";

import StakingContentCard from "./StakingContentCard";

const meta = {
  title: "pool/StakingContentCard",
  component: StakingContentCard,
  tags: ["autodocs"],
} satisfies Meta<typeof StakingContentCard>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof StakingContentCard>]?: React.ComponentProps<typeof StakingContentCard>[K];
}>;

export const ActiveStaking: Story = {
  args: {
    breakpoint: DEVICE_TYPE.WEB,
  },
};

export const UnActiveStaking: Story = {
  args: {
    breakpoint: DEVICE_TYPE.WEB,
  },
};
