import CopyReferralLink from "./CopyReferralLink";
import { ComponentMeta, StoryObj } from "@storybook/react";

export default {
  title: "leaderboard/CopyReferralLink",
  component: CopyReferralLink,
} as ComponentMeta<typeof CopyReferralLink>;

export const Connected: StoryObj<typeof CopyReferralLink> = {
  args: { connected: true, address: "temp_addr" },
  parameters: {
    backgrounds: { default: "light" },
  },
};

export const NotConnected: StoryObj<typeof CopyReferralLink> = {
  args: { connected: false },
  parameters: {
    backgrounds: { default: "light" },
  },
};
