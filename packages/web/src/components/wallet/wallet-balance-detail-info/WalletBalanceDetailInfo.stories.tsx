import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import WalletBalanceDetailInfo from "./WalletBalanceDetailInfo";
import { DEVICE_TYPE } from "@styles/media";

export default {
  title: "wallet/WalletBalance/WalletBalanceDetail/WalletBalanceDetailInfo",
  component: WalletBalanceDetailInfo,
} as ComponentMeta<typeof WalletBalanceDetailInfo>;

const Template: ComponentStory<typeof WalletBalanceDetailInfo> = args => (
  <WalletBalanceDetailInfo {...args} />
);

export const Default = Template.bind({});
Default.args = {
  title: "Default",
  value: "$1.10",
  tooltip: undefined,
};

export const DefaultTooltip = Template.bind({});
DefaultTooltip.args = {
  title: "DefaultTooltip",
  value: "$1.10",
  tooltip: "Hello world",
};
