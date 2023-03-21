import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import WalletBalanceSummary from "./WalletBalanceSummary";

export default {
  title: "wallet/WalletBalanceSummary",
  component: WalletBalanceSummary,
} as ComponentMeta<typeof WalletBalanceSummary>;

const Template: ComponentStory<typeof WalletBalanceSummary> = args => (
  <WalletBalanceSummary {...args} />
);

export const Default = Template.bind({});
Default.args = {};
