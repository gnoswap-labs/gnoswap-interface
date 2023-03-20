import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import WalletBalanceDetail from "./WalletBalanceDetail";

export default {
  title: "wallet/WalletBalanceDetail",
  component: WalletBalanceDetail,
} as ComponentMeta<typeof WalletBalanceDetail>;

const Template: ComponentStory<typeof WalletBalanceDetail> = args => (
  <WalletBalanceDetail {...args} />
);

export const Default = Template.bind({});
Default.args = {};
