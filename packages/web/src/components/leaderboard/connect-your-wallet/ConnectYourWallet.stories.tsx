import ConnectYourWallet from "./ConnectYourWallet";
import { ComponentMeta, StoryObj } from "@storybook/react";

export default {
  title: "leaderboard/ConnectYourWallet",
  component: ConnectYourWallet,
} as ComponentMeta<typeof ConnectYourWallet>;

export const Default: StoryObj<typeof ConnectYourWallet> = {
  args: {
    connected: true,
    isMobile: true,
    checked: true,
    onSwitch: () => console.log("ConnectYourWallet"),
  },
  parameters: {
    backgrounds: { default: "light" },
  },
};
