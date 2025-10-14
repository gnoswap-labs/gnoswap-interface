import type { Meta, StoryObj } from "@storybook/nextjs";

import SelectLiquidity from "./SelectLiquidity";

const meta = {
  title: "pool/pool-unstake/SelectLiquidity",
  component: SelectLiquidity,
  tags: ["autodocs"],
} satisfies Meta<typeof SelectLiquidity>;

export default meta;
type Story = StoryObj<typeof SelectLiquidity>;

export const Default: Story = {
  args: {},
};
