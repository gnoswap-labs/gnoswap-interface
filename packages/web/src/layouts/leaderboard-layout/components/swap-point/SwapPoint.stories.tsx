import type { Meta, StoryObj } from "@storybook/nextjs";

import SwapPoint from "./SwapPoint";

const meta = {
  title: "leaderboard/SwapPoint",
  component: SwapPoint,
  tags: ["autodocs"],
  parameters: {
    backgrounds: { default: "light" },
  },
} satisfies Meta<typeof SwapPoint>;

export default meta;
type Story = StoryObj<typeof SwapPoint>;

export const Default: Story = {
  args: {
    swapPoint: "37.37",
    swapRawPoint: "37.37",
    swapCapPoint: "205403.55",
  },
};

export const CapReached: Story = {
  args: {
    swapPoint: "5000",
    swapRawPoint: "6000",
    swapCapPoint: "5000",
  },
};
