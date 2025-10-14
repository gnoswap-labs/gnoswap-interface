import type { Meta, StoryObj } from "@storybook/nextjs";

import UnstakeLiquidity from "./UnstakeLiquidity";

const meta = {
  title: "pool/pool-unstake/UnstakeLiquidity",
  component: UnstakeLiquidity,
  tags: ["autodocs"],
} satisfies Meta<typeof UnstakeLiquidity>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof UnstakeLiquidity>]?: React.ComponentProps<typeof UnstakeLiquidity>[K];
}>;

export const Default: Story = {
  args: {},
};
