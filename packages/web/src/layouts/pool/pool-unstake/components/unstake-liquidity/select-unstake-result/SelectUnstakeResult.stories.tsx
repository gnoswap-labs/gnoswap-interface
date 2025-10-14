import type { Meta, StoryObj } from "@storybook/nextjs";

import SelectUnstakeResult from "./SelectUnstakeResult";

const meta = {
  title: "pool/pool-unstake/SelectUnstakeResult",
  component: SelectUnstakeResult,
  tags: ["autodocs"],
} satisfies Meta<typeof SelectUnstakeResult>;

export default meta;
type Story = StoryObj<typeof SelectUnstakeResult>;

export const Default: Story = {
  args: {},
};
