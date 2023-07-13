import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import WalletBalance from "./WalletBalance";

export default {
  title: "wallet/WalletBalance",
  component: WalletBalance,
} as ComponentMeta<typeof WalletBalance>;

const Template: ComponentStory<typeof WalletBalance> = args => (
  <WalletBalance {...args} />
);

export const ConnectionSucceeded = Template.bind({});
ConnectionSucceeded.args = {
  connected: true,
  balanceSummaryInfo: {
    amount: "$1,000.00",
    changeRate: "+1.1%",
  },
  balanceDetailInfo: {
    availableBalance: "$1.10",
    stakedLP: "$1.20",
    unstakingLP: "$1.30",
    claimableRewards: "$1.40",
  },
  deposit: action("deposit"),
  withdraw: action("withdraw"),
  claimAll: action("claimAll"),
};

export const ConnectionFailed = Template.bind({});
ConnectionFailed.args = {
  connected: false,
  balanceSummaryInfo: {
    amount: "$0.00",
    changeRate: "+0%",
  },
  balanceDetailInfo: {
    availableBalance: "$0.00",
    stakedLP: "$0.00",
    unstakingLP: "$0.00",
    claimableRewards: "$0.00",
  },
  deposit: action("deposit"),
  withdraw: action("withdraw"),
};

export const LoadingData = Template.bind({});
LoadingData.args = {
  connected: true,
  balanceSummaryInfo: {
    amount: "$0.00",
    changeRate: "+0%",
  },
  balanceDetailInfo: {
    availableBalance: "$0.00",
    stakedLP: "$0.00",
    unstakingLP: "$0.00",
    claimableRewards: "$0.00",
  },
  deposit: action("deposit"),
  withdraw: action("withdraw"), claimAll: action("claimAll"),
};
