import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import WalletBalanceDetail from "./WalletBalanceDetail";

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
};
