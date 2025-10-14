import type { Meta, StoryObj } from "@storybook/nextjs";

import UnstakeLiquidity from "./UnstakeLiquidity";

const meta = {
  title: "pool/pool-unstake/UnstakeLiquidity",
  component: UnstakeLiquidity,
  tags: ["autodocs"],
} satisfies Meta<typeof UnstakeLiquidity>;

export default meta;
type Story = StoryObj<typeof UnstakeLiquidity>;

export const Default: Story = {
  args: {},
};
