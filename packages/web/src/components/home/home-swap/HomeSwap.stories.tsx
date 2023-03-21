import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import HomeSwap from "./HomeSwap";
import { action } from "@storybook/addon-actions";

export default {
  title: "home/HomeSwap",
  component: HomeSwap,
} as ComponentMeta<typeof HomeSwap>;

const Template: ComponentStory<typeof HomeSwap> = args => (
  <HomeSwap {...args} />
);

export const Default = Template.bind({});
Default.args = {
  from: {
    token: "ETH",
    amount: "121",
    price: "$0.00",
    balence: "0",
  },
  to: {
    token: "BTC",
    amount: "5,000",
    price: "$0.00",
    balence: "0",
  },
  swapNow: action("swapNow"),
};
