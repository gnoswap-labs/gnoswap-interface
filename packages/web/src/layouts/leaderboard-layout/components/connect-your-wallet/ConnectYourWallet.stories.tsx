import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";

import ConnectYourWallet from "./ConnectYourWallet";

const meta = {
  title: "leaderboard/ConnectYourWallet",
  component: ConnectYourWallet,
  tags: ["autodocs"],
} satisfies Meta<typeof ConnectYourWallet>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof ConnectYourWallet>]?: React.ComponentProps<typeof ConnectYourWallet>[K];
}>;

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
