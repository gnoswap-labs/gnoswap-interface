import ConnectYourWallet from "./ConnectYourWallet";
import { ComponentMeta, StoryObj } from "@storybook/react";

export default {
  title: "leaderboard/ConnectYourWallet",
  component: ConnectYourWallet,
} as ComponentMeta<typeof ConnectYourWallet>;

export const Default: StoryObj<typeof ConnectYourWallet> = {
  args: { connected: false, isMobile: false },
  parameters: {
    backgrounds: { default: "light" },
  },
};
