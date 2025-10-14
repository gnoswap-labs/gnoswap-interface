import type { Meta, StoryObj } from "@storybook/nextjs";

import HideMe from "./HideMe";

const meta = {
  title: "leaderboard/HideMe",
  component: HideMe,
  tags: ["autodocs"],
  parameters: {
    backgrounds: { default: "light" },
  },
} satisfies Meta<typeof HideMe>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Mobile: Story = {
  args: {
    isMobile: true,
  },
};

export const Web: Story = {
  args: {
    isMobile: false,
  },
};
