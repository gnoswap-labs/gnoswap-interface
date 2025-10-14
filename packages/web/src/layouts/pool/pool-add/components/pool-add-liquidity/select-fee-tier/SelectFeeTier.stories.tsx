import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";

import SelectFeeTier from "./SelectFeeTier";

const meta = {
  title: "pool/pool-add/SelectFeeTier",
  component: SelectFeeTier,
  tags: ["autodocs"],
  parameters: {
    backgrounds: { default: "light" },
  },
} satisfies Meta<typeof SelectFeeTier>;

export default meta;
type Story = StoryObj<typeof SelectFeeTier>;

export const Default: Story = {
  args: {
    feeTiers: [],
    selectFeeTier: fn(),
  },
};
