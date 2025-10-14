import type { Meta, StoryObj } from "@storybook/nextjs";

import CopyReferralLink from "./CopyReferralLink";

const meta = {
  title: "leaderboard/CopyReferralLink",
  component: CopyReferralLink,
  tags: ["autodocs"],
  parameters: {
    backgrounds: { default: "light" },
  },
} satisfies Meta<typeof CopyReferralLink>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof CopyReferralLink>]?: React.ComponentProps<typeof CopyReferralLink>[K];
}>;

export const Connected: Story = {
  args: {
    connected: true,
    address: "temp_addr",
  },
};

export const NotConnected: Story = {
  args: {
    connected: false,
  },
};
