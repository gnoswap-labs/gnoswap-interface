import type { Meta, StoryObj } from "@storybook/nextjs";

import StakingContentCard from "./StakingContentCard";

const meta = {
  title: "pool/StakingContentCard",
  component: StakingContentCard,
  tags: ["autodocs"],
} satisfies Meta<typeof StakingContentCard>;

export default meta;
type Story = StoryObj<typeof StakingContentCard>;

export const ActiveStaking: Story = {
  args: {
    loading: false,
  },
};

export const UnActiveStaking: Story = {
  args: {
    loading: false,
  },
};
