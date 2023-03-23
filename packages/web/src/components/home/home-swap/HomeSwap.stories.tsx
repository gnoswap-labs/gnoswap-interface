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
    token: "GNOT",
    amount: "121",
    price: "$0.00",
    balence: "0",
  },
  to: {
    token: "GNOS",
    amount: "5000",
    price: "$0.00",
    balence: "0",
  },
  swapNow: action("swapNow"),
};
