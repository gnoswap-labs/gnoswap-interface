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
    token: {
      chainId: "dev",
      createdAt: "2023-10-10T08:48:46+09:00",
      name: "Gnoswap",
      address: "g1sqaft388ruvsseu97r04w4rr4szxkh4nn6xpax",
      path: "gno.land/r/gnos",
      decimals: 4,
      symbol: "GNOS",
      logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/5994.png",
      priceId: "gno.land/r/gnos"
    },
    amount: "121",
    price: "$0.00",
    balance: "0",
  },
  to: {
    token: {
      chainId: "dev",
      createdAt: "2023-10-10T08:48:46+09:00",
      name: "Gnoswap",
      address: "g1sqaft388ruvsseu97r04w4rr4szxkh4nn6xpax",
      path: "gno.land/r/gnos",
      decimals: 4,
      symbol: "GNOS",
      logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/5994.png",
      priceId: "gno.land/r/gnos"
    },
    amount: "5000",
    price: "$0.00",
    balance: "0",
  },
  swapNow: action("swapNow"),
};
