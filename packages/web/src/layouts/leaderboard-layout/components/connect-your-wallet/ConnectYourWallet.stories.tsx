import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";

import ConnectYourWallet from "./ConnectYourWallet";

const meta = {
  title: "leaderboard/ConnectYourWallet",
  component: ConnectYourWallet,
  tags: ["autodocs"],
} satisfies Meta<typeof ConnectYourWallet>;

export default meta;
type Story = StoryObj<typeof ConnectYourWallet>;

export const Default: Story = {
  args: {
    connected: true,
    isMobile: true,
    checked: true,
    onSwitch: fn(),
  },
  parameters: {
    backgrounds: { default: "light" },
  },
};
