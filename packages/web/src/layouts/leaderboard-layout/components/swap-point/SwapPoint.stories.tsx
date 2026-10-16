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
    swapPoint: "1234.56",
    swapRawPoint: "6000",
    swapCapPoint: "5000",
  },
};
