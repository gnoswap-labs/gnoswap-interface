import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import WalletBalanceSummaryInfo from "./WalletBalanceSummaryInfo";

export default {
  title: "wallet/WalletBalance/WalletBalanceSummary/WalletBalanceSummaryInfo",
  component: WalletBalanceSummaryInfo,
} as ComponentMeta<typeof WalletBalanceSummaryInfo>;

const Template: ComponentStory<typeof WalletBalanceSummaryInfo> = args => (
  <WalletBalanceSummaryInfo {...args} />
);

export const Default = Template.bind({});
Default.args = {
  balanceSummaryInfo: {
    amount: "1,000.00",
    changeRate: "+1.10%",
    loading: false,
  },
};
