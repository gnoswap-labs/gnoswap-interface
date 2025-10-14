import type { Meta, StoryObj } from "@storybook/nextjs";

import SelectLiquidity from "./SelectLiquidity";

const meta = {
  title: "pool/pool-unstake/SelectLiquidity",
  component: SelectLiquidity,
  tags: ["autodocs"],
} satisfies Meta<typeof SelectLiquidity>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof SelectLiquidity>]?: React.ComponentProps<typeof SelectLiquidity>[K];
}>;

export const Default: Story = {
  args: {},
};
