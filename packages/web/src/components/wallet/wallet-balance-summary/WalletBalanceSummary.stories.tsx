import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import WalletBalanceSummary from "./WalletBalanceSummary";
import { DEVICE_TYPE } from "@styles/media";

export default {
  title: "wallet/WalletBalance/WalletBalanceSummary",
  component: WalletBalanceSummary,
} as ComponentMeta<typeof WalletBalanceSummary>;

const Template: ComponentStory<typeof WalletBalanceSummary> = ({
  balanceSummaryInfo,
  ...args
}) => (
  <WalletBalanceSummary balanceSummaryInfo={balanceSummaryInfo} {...args} />
);

export const ConnectionSucceeded = Template.bind({});
ConnectionSucceeded.args = {
  connected: true,
  balanceSummaryInfo: {
    amount: "1,000.00",
    changeRate: "+1.10%",
    loading: false,
  },
  deposit: action("deposit"),
  withdraw: action("withdraw"),
};

export const ConnectionFailed = Template.bind({});
ConnectionFailed.args = {
  connected: false,
  balanceSummaryInfo: {
    amount: "0.00",
    changeRate: "+0%",
    loading: false,
  },
  deposit: action("deposit"),
  withdraw: action("withdraw"),
  breakpoint: DEVICE_TYPE.WEB,
};
