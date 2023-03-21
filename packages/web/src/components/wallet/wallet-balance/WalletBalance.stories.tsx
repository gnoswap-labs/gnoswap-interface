import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import WalletBalance from "./WalletBalance";

export default {
  title: "wallet/WalletBalance",
  component: WalletBalance,
} as ComponentMeta<typeof WalletBalance>;

const Template: ComponentStory<typeof WalletBalance> = args => (
  <WalletBalance {...args} />
);

export const Default = Template.bind({});
Default.args = {};
