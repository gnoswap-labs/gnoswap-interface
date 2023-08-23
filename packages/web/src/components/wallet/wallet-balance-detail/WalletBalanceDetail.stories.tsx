import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import WalletBalanceDetail from "./WalletBalanceDetail";
import { action } from "@storybook/addon-actions";
import { DEVICE_TYPE } from "@styles/media";

export default {
  title: "wallet/WalletBalance/WalletBalanceDetail",
  component: WalletBalanceDetail,
} as ComponentMeta<typeof WalletBalanceDetail>;

const Template: ComponentStory<typeof WalletBalanceDetail> = args => (
  <WalletBalanceDetail {...args} />
);

export const Default = Template.bind({});
Default.args = {
  balanceDetailInfo: {
    availableBalance: "$1.10",
    stakedLP: "$1.20",
    unstakingLP: "$1.30",
    claimableRewards: "$1.40",
  },
  connected: true,
  claimAll: action("claimAll"),
  breakpoint: DEVICE_TYPE.WEB,
};
